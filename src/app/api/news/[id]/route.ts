
import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import {
  getContentStatus,
  getNewsCategory,
  sanitizeNewsHtml,
  slugify,
} from "@/lib/news";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function permissionResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (message.includes("UNAUTHORIZED")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (message.includes("FORBIDDEN")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    await requirePermission("content.view");

    const { id } = await params;

    const article = await prisma.newsArticle.findUnique({
      where: { id },
      include: {
        createdBy: { select: { id: true, name: true } },
        updatedBy: { select: { id: true, name: true } },
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    const response = permissionResponse(error);
    if (response) return response;

    console.error("GET /api/news/[id] error:", error);
    return NextResponse.json(
      { error: "Unable to load the article." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  try {
    await requirePermission("content.edit");

    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.newsArticle.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Article not found." },
        { status: 404 },
      );
    }

    const data: Record<string, unknown> = {
      updatedById: user.id,
    };

    if (typeof body.title === "string") {
      const title = body.title.trim();

      if (!title) {
        return NextResponse.json(
          { error: "Article title cannot be empty." },
          { status: 400 },
        );
      }

      data.title = title;
    }

    if (typeof body.slug === "string" || typeof body.title === "string") {
      const requestedSlug =
        typeof body.slug === "string" && body.slug.trim()
          ? slugify(body.slug)
          : typeof body.title === "string"
            ? slugify(body.title)
            : existing.slug;

      if (!requestedSlug) {
        return NextResponse.json(
          { error: "Please provide a valid article slug." },
          { status: 400 },
        );
      }

      const conflicting = await prisma.newsArticle.findFirst({
        where: {
          slug: requestedSlug,
          NOT: { id },
        },
        select: { id: true },
      });

      if (conflicting) {
        return NextResponse.json(
          { error: "That slug is already used by another article." },
          { status: 409 },
        );
      }

      data.slug = requestedSlug;
    }

    if (typeof body.excerpt === "string") {
      if (!body.excerpt.trim()) {
        return NextResponse.json(
          { error: "Article excerpt cannot be empty." },
          { status: 400 },
        );
      }

      data.excerpt = body.excerpt.trim();
    }

    if (typeof body.content === "string") {
      if (!body.content.trim()) {
        return NextResponse.json(
          { error: "Article content cannot be empty." },
          { status: 400 },
        );
      }

      data.content = sanitizeNewsHtml(body.content);
    }

    if (body.category !== undefined) {
      const category = getNewsCategory(body.category);

      if (!category) {
        return NextResponse.json(
          { error: "Invalid news category." },
          { status: 400 },
        );
      }

      data.category = category;
    }

    if (body.status !== undefined) {
      const status = getContentStatus(body.status);

      if (!status) {
        return NextResponse.json(
          { error: "Invalid publishing status." },
          { status: 400 },
        );
      }

      data.status = status;

      if (status === "PUBLISHED" && !existing.publishedAt) {
        data.publishedAt = new Date();
      }

      if (status === "DRAFT") {
        data.publishedAt = null;
      }
    }

    for (const field of [
      "imageUrl",
      "imageAlt",
      "location",
      "seoTitle",
      "seoDescription",
    ] as const) {
      if (body[field] === null) {
        data[field] = null;
      } else if (typeof body[field] === "string") {
        data[field] = body[field].trim() || null;
      }
    }

    if (typeof body.isFeatured === "boolean") {
      data.isFeatured = body.isFeatured;
    }

    const article = await prisma.newsArticle.update({
      where: { id },
      data: data as never,
    });

    return NextResponse.json({ article });
  } catch (error) {
    const response = permissionResponse(error);
    if (response) return response;

    console.error("PATCH /api/news/[id] error:", error);
    return NextResponse.json(
      { error: "Unable to update the article." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    await requirePermission("content.delete");

    const { id } = await params;

    const existing = await prisma.newsArticle.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Article not found." },
        { status: 404 },
      );
    }

    await prisma.newsArticle.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    const response = permissionResponse(error);
    if (response) return response;

    console.error("DELETE /api/news/[id] error:", error);
    return NextResponse.json(
      { error: "Unable to delete the article." },
      { status: 500 },
    );
  }
}
