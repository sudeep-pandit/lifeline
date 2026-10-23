import { NextResponse } from "next/server";

import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    await requirePermission("content.view");

    const { id } = await context.params;

    const content = await prisma.contentItem.findUnique({
      where: {
        id,
      },

      include: {
        createdBy: {
          select: {
            name: true,
          },
        },

        updatedBy: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          message: "Content not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Content GET by ID error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load content.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const user = await requirePermission("content.edit");

    const { id } = await context.params;
    const body = await request.json();

    const existing = await prisma.contentItem.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Content not found.",
        },
        {
          status: 404,
        },
      );
    }

    const {
      title,
      key,
      slug,
      type,
      status,
      excerpt,
      content,
      imageUrl,
      seoTitle,
      seoDescription,
      seoKeywords,
      isHomepage,
      isFeatured,
      sortOrder,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!key?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Content key is required.",
        },
        {
          status: 400,
        },
      );
    }

    const normalizedKey = key
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

    const finalSlug =
      slug?.trim() || slugify(title);

    const duplicateKey = await prisma.contentItem.findFirst({
      where: {
        key: normalizedKey,
        NOT: {
          id,
        },
      },
    });

    if (duplicateKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Another content item already uses this key.",
        },
        {
          status: 409,
        },
      );
    }

    const duplicateSlug = await prisma.contentItem.findFirst({
      where: {
        slug: finalSlug,
        NOT: {
          id,
        },
      },
    });

    if (duplicateSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "Another content item already uses this slug.",
        },
        {
          status: 409,
        },
      );
    }

    const updated = await prisma.contentItem.update({
      where: {
        id,
      },

      data: {
        title: title.trim(),
        key: normalizedKey,
        slug: finalSlug || null,

        type:
          type === "SECTION"
            ? "SECTION"
            : "PAGE",

        status:
          status === "PUBLISHED"
            ? "PUBLISHED"
            : "DRAFT",

        excerpt: excerpt?.trim() || null,
        content: content || null,
        imageUrl: imageUrl?.trim() || null,

        seoTitle: seoTitle?.trim() || null,
        seoDescription: seoDescription?.trim() || null,
        seoKeywords: seoKeywords?.trim() || null,

        isHomepage: Boolean(isHomepage),
        isFeatured: Boolean(isFeatured),

        sortOrder:
          Number.isFinite(Number(sortOrder))
            ? Number(sortOrder)
            : 0,

        updatedById: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Content updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("Content PATCH error:", error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to edit content.",
        },
        {
          status: 403,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update content.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    await requirePermission("content.delete");

    const { id } = await context.params;

    const existing = await prisma.contentItem.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Content not found.",
        },
        {
          status: 404,
        },
      );
    }

    await prisma.contentItem.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Content deleted successfully.",
    });
  } catch (error) {
    console.error("Content DELETE error:", error);

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to delete content.",
        },
        {
          status: 403,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete content.",
      },
      {
        status: 500,
      },
    );
  }
}