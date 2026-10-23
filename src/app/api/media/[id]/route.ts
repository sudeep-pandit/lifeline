import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const UPLOAD_DIRECTORY = path.join(
  process.cwd(),
  "public",
  "uploads",
  "media",
);

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/*
|--------------------------------------------------------------------------
| GET /api/media/:id
|--------------------------------------------------------------------------
| Get a single media item.
*/
export async function GET(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    await requirePermission("media.view");

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Media ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const media = await prisma.media.findUnique({
      where: {
        id,
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            slug: true,
            parentId: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!media) {
      return NextResponse.json(
        {
          error: "Media not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      media,
    });
  } catch (error) {
    console.error(
      "GET /api/media/[id] error:",
      error,
    );

    const message =
      error instanceof Error ? error.message : "";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    if (message === "FORBIDDEN") {
      return NextResponse.json(
        {
          error:
            "You do not have permission to view media.",
        },
        {
          status: 403,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to load media.",
      },
      {
        status: 500,
      },
    );
  }
}

/*
|--------------------------------------------------------------------------
| PATCH /api/media/:id
|--------------------------------------------------------------------------
| Update:
| - alt text
| - folder
*/
export async function PATCH(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    await requirePermission("media.edit");

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Media ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const existingMedia =
      await prisma.media.findUnique({
        where: {
          id,
        },
      });

    if (!existingMedia) {
      return NextResponse.json(
        {
          error: "Media not found.",
        },
        {
          status: 404,
        },
      );
    }

    const body = await request.json();

    const data: {
      alt?: string | null;
      folderId?: string | null;
    } = {};

    /*
     * Update alt text
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "alt",
      )
    ) {
      if (
        body.alt !== null &&
        typeof body.alt !== "string"
      ) {
        return NextResponse.json(
          {
            error:
              "Alt text must be a string or null.",
          },
          {
            status: 400,
          },
        );
      }

      const alt =
        typeof body.alt === "string"
          ? body.alt.trim()
          : "";

      if (alt.length > 500) {
        return NextResponse.json(
          {
            error:
              "Alt text cannot exceed 500 characters.",
          },
          {
            status: 400,
          },
        );
      }

      data.alt = alt || null;
    }

    /*
     * Move media to another folder
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "folderId",
      )
    ) {
      if (
        body.folderId !== null &&
        typeof body.folderId !== "string"
      ) {
        return NextResponse.json(
          {
            error:
              "Folder ID must be a string or null.",
          },
          {
            status: 400,
          },
        );
      }

      const folderId =
        typeof body.folderId === "string" &&
        body.folderId.trim()
          ? body.folderId.trim()
          : null;

      if (folderId) {
        const folder =
          await prisma.mediaFolder.findUnique({
            where: {
              id: folderId,
            },
          });

        if (!folder) {
          return NextResponse.json(
            {
              error:
                "Destination folder not found.",
            },
            {
              status: 404,
            },
          );
        }
      }

      data.folderId = folderId;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        {
          error:
            "No changes were provided.",
        },
        {
          status: 400,
        },
      );
    }

    const media = await prisma.media.update({
      where: {
        id,
      },
      data,
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            slug: true,
            parentId: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: "Media updated successfully.",
      media,
    });
  } catch (error) {
    console.error(
      "PATCH /api/media/[id] error:",
      error,
    );

    const message =
      error instanceof Error ? error.message : "";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    if (message === "FORBIDDEN") {
      return NextResponse.json(
        {
          error:
            "You do not have permission to edit media.",
        },
        {
          status: 403,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to update media.",
      },
      {
        status: 500,
      },
    );
  }
}

/*
|--------------------------------------------------------------------------
| DELETE /api/media/:id
|--------------------------------------------------------------------------
| Deletes:
| 1. Physical file
| 2. Database record
*/
export async function DELETE(
  _request: NextRequest,
  context: RouteContext,
) {
  try {
    await requirePermission("media.delete");

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          error: "Media ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const media = await prisma.media.findUnique({
      where: {
        id,
      },
    });

    if (!media) {
      return NextResponse.json(
        {
          error: "Media not found.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Physical storage:
     *
     * public/uploads/media/<filename>
     */
    const filePath = path.join(
      UPLOAD_DIRECTORY,
      media.filename,
    );

    try {
      await fs.unlink(filePath);
    } catch (error) {
      const code =
        error &&
        typeof error === "object" &&
        "code" in error
          ? error.code
          : undefined;

      /*
       * If the file is already missing,
       * still remove the database record.
       */
      if (code !== "ENOENT") {
        console.error(
          "Failed to delete physical media file:",
          error,
        );

        return NextResponse.json(
          {
            error:
              "The physical media file could not be deleted.",
          },
          {
            status: 500,
          },
        );
      }
    }

    await prisma.media.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Media deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/media/[id] error:",
      error,
    );

    const message =
      error instanceof Error ? error.message : "";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    if (message === "FORBIDDEN") {
      return NextResponse.json(
        {
          error:
            "You do not have permission to delete media.",
        },
        {
          status: 403,
        },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to delete media.",
      },
      {
        status: 500,
      },
    );
  }
}