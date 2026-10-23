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

export async function GET(request: Request) {
  try {
    await requirePermission("content.view");

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const type = searchParams.get("type");
    const status = searchParams.get("status");

    const content = await prisma.contentItem.findMany({
      where: {
        ...(search
          ? {
              OR: [
                {
                  title: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  key: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  slug: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),

        ...(type === "PAGE" || type === "SECTION"
          ? {
              type,
            }
          : {}),

        ...(status === "DRAFT" || status === "PUBLISHED"
          ? {
              status,
            }
          : {}),
      },

      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],

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

    return NextResponse.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Content GET error:", error);

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
          message: "You do not have permission to view content.",
        },
        {
          status: 403,
        },
      );
    }

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

export async function POST(request: Request) {
  try {
    const user = await requirePermission("content.create");

    const body = await request.json();

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

    const existing = await prisma.contentItem.findUnique({
      where: {
        key: normalizedKey,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "A content item with this key already exists.",
        },
        {
          status: 409,
        },
      );
    }

    const finalSlug =
      slug?.trim() || slugify(title);

    const existingSlug = await prisma.contentItem.findUnique({
      where: {
        slug: finalSlug,
      },
    });

    if (existingSlug) {
      return NextResponse.json(
        {
          success: false,
          message: "A content item with this slug already exists.",
        },
        {
          status: 409,
        },
      );
    }

    const created = await prisma.contentItem.create({
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

        createdById: user.id,
        updatedById: user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Content created successfully.",
        data: created,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Content POST error:", error);

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
          message: "You do not have permission to create content.",
        },
        {
          status: 403,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create content.",
      },
      {
        status: 500,
      },
    );
  }
}