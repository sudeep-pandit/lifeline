import { NextRequest, NextResponse } from "next/server";

import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type FolderParent = {
  parentId: string | null;
} | null;

function createSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function errorResponse(
  error: string,
  status: number,
) {
  return NextResponse.json({ error }, { status });
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "";
}

function handlePermissionError(
  error: unknown,
  action: "view" | "edit" | "delete",
) {
  const message = getErrorMessage(error);

  if (message === "UNAUTHORIZED") {
    return errorResponse("Unauthorized.", 401);
  }

  if (message === "FORBIDDEN") {
    const messages = {
      view: "You do not have permission to view folders.",
      edit: "You do not have permission to edit folders.",
      delete: "You do not have permission to delete folders.",
    };

    return errorResponse(messages[action], 403);
  }

  return null;
}

/**
 * Returns true if possibleParentId is the folder itself
 * or one of its descendants.
 *
 * This prevents circular folder relationships when moving folders.
 */
async function isDescendant(
  folderId: string,
  possibleParentId: string,
): Promise<boolean> {
  let currentId: string | null = possibleParentId;

  const visited = new Set<string>();

  while (currentId) {
    if (currentId === folderId) {
      return true;
    }

    // Protect against an existing circular relationship.
    if (visited.has(currentId)) {
      return true;
    }

    visited.add(currentId);

    const currentFolder: FolderParent =
      await prisma.mediaFolder.findUnique({
        where: {
          id: currentId,
        },
        select: {
          parentId: true,
        },
      });

    if (!currentFolder) {
      return false;
    }

    currentId = currentFolder.parentId;
  }

  return false;
}

/**
 * GET /api/media/folders/:id
 * Retrieve a folder with its parent, children and counts.
 */
export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    await requirePermission("media.view");

    const { id } = await context.params;

    if (!id) {
      return errorResponse("Folder ID is required.", 400);
    }

    const folder = await prisma.mediaFolder.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            media: true,
            children: true,
          },
        },
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
            parentId: true,
          },
        },
        children: {
          orderBy: {
            name: "asc",
          },
          select: {
            id: true,
            name: true,
            slug: true,
            parentId: true,
          },
        },
      },
    });

    if (!folder) {
      return errorResponse("Folder not found.", 404);
    }

    return NextResponse.json({ folder });
  } catch (error) {
    console.error("GET /api/media/folders/[id] error:", error);

    const permissionError = handlePermissionError(error, "view");

    if (permissionError) {
      return permissionError;
    }

    return errorResponse("Failed to load folder.", 500);
  }
}

/**
 * PATCH /api/media/folders/:id
 *
 * Supports:
 * - Renaming a folder
 * - Moving a folder into another folder
 * - Moving a folder to the root with { "parentId": null }
 */
export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    await requirePermission("media.edit");

    const { id } = await context.params;

    if (!id) {
      return errorResponse("Folder ID is required.", 400);
    }

    const existingFolder = await prisma.mediaFolder.findUnique({
      where: {
        id,
      },
    });

    if (!existingFolder) {
      return errorResponse("Folder not found.", 404);
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse("Invalid JSON request body.", 400);
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return errorResponse(
        "Request body must be a JSON object.",
        400,
      );
    }

    const input = body as Record<string, unknown>;

    const data: {
      name?: string;
      slug?: string;
      parentId?: string | null;
    } = {};

    // Rename folder.
    if (Object.prototype.hasOwnProperty.call(input, "name")) {
      if (typeof input.name !== "string") {
        return errorResponse(
          "Folder name must be a string.",
          400,
        );
      }

      const name = input.name.trim();

      if (!name) {
        return errorResponse(
          "Folder name is required.",
          400,
        );
      }

      if (name.length > 100) {
        return errorResponse(
          "Folder name cannot exceed 100 characters.",
          400,
        );
      }

      const slug = createSlug(name);

      if (!slug) {
        return errorResponse("Invalid folder name.", 400);
      }

      // Ensure the slug is unique, excluding the current folder.
      let finalSlug = slug;
      let counter = 2;

      while (true) {
        const existing = await prisma.mediaFolder.findFirst({
          where: {
            slug: finalSlug,
            NOT: {
              id,
            },
          },
          select: {
            id: true,
          },
        });

        if (!existing) {
          break;
        }

        finalSlug = `${slug}-${counter}`;
        counter += 1;
      }

      data.name = name;
      data.slug = finalSlug;
    }

    // Move folder.
    if (
      Object.prototype.hasOwnProperty.call(input, "parentId")
    ) {
      if (
        input.parentId !== null &&
        typeof input.parentId !== "string"
      ) {
        return errorResponse(
          "Parent folder ID must be a string or null.",
          400,
        );
      }

      const parentId =
        typeof input.parentId === "string"
          ? input.parentId.trim() || null
          : null;

      // Move to the root.
      if (parentId === null) {
        data.parentId = null;
      } else {
        // A folder cannot be its own parent.
        if (parentId === id) {
          return errorResponse(
            "A folder cannot be moved inside itself.",
            400,
          );
        }

        const parent = await prisma.mediaFolder.findUnique({
          where: {
            id: parentId,
          },
          select: {
            id: true,
          },
        });

        if (!parent) {
          return errorResponse(
            "Destination parent folder not found.",
            404,
          );
        }

        // Prevent moving a folder into one of its descendants.
        const descendant = await isDescendant(id, parentId);

        if (descendant) {
          return errorResponse(
            "A folder cannot be moved inside one of its own subfolders.",
            400,
          );
        }

        data.parentId = parentId;
      }
    }

    if (Object.keys(data).length === 0) {
      return errorResponse(
        "No changes were provided.",
        400,
      );
    }

    const folder = await prisma.mediaFolder.update({
      where: {
        id,
      },
      data,
      include: {
        _count: {
          select: {
            media: true,
            children: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Folder updated successfully.",
      folder,
    });
  } catch (error) {
    console.error("PATCH /api/media/folders/[id] error:", error);

    const permissionError = handlePermissionError(error, "edit");

    if (permissionError) {
      return permissionError;
    }

    return errorResponse("Failed to update folder.", 500);
  }
}

/**
 * DELETE /api/media/folders/:id
 *
 * A folder can only be deleted if it contains no media
 * and no child folders.
 */
export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    await requirePermission("media.delete");

    const { id } = await context.params;

    if (!id) {
      return errorResponse("Folder ID is required.", 400);
    }

    const folder = await prisma.mediaFolder.findUnique({
      where: {
        id,
      },
      include: {
        _count: {
          select: {
            media: true,
            children: true,
          },
        },
      },
    });

    if (!folder) {
      return errorResponse("Folder not found.", 404);
    }

    if (folder._count.media > 0) {
      return NextResponse.json(
        {
          error:
            "This folder contains media. Move or delete the media before deleting the folder.",
          mediaCount: folder._count.media,
        },
        { status: 409 },
      );
    }

    if (folder._count.children > 0) {
      return NextResponse.json(
        {
          error:
            "This folder contains subfolders. Delete or move the subfolders before deleting this folder.",
          childrenCount: folder._count.children,
        },
        { status: 409 },
      );
    }

    await prisma.mediaFolder.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Folder deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/media/folders/[id] error:", error);

    const permissionError = handlePermissionError(error, "delete");

    if (permissionError) {
      return permissionError;
    }

    return errorResponse("Failed to delete folder.", 500);
  }
}
