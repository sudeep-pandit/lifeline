
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

import type { Prisma } from "@/generated/prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function permissionResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (message.includes("UNAUTHORIZED")) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (message.includes("FORBIDDEN")) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  return null;
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function databaseUnavailableResponse() {
  console.error(
    "NewsArticle model is missing from the Prisma Client. Check the generator output and run npx prisma generate.",
  );

  return NextResponse.json(
    {
      error:
        "The news database client is not ready. Run npx prisma generate and restart the development server.",
    },
    { status: 500 },
  );
}

function newsModelAvailable() {
  return (
    typeof (
      prisma as unknown as {
        newsArticle?: {
          findMany?: unknown;
          findFirst?: unknown;
          create?: unknown;
        };
      }
    ).newsArticle?.findMany === "function" &&
    typeof (
      prisma as unknown as {
        newsArticle?: {
          findFirst?: unknown;
        };
      }
    ).newsArticle?.findFirst === "function" &&
    typeof (
      prisma as unknown as {
        newsArticle?: {
          create?: unknown;
        };
      }
    ).newsArticle?.create === "function"
  );
}

function optionalString(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed || null;
}

function validHttpUrl(value: string | null): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    await requirePermission("content.view");

    if (!newsModelAvailable()) {
      return databaseUnavailableResponse();
    }

    const params = request.nextUrl.searchParams;
    const search = params.get("search")?.trim() ?? "";
    const categoryParam = params.get("category");
    const statusParam = params.get("status");

    const conditions: Prisma.NewsArticleWhereInput = {};

    if (search) {
      conditions.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    const category = getNewsCategory(categoryParam);
    if (category) {
      conditions.category = category;
    }

    const status = getContentStatus(statusParam);
    if (status) {
      conditions.status = status;
    }

    const articles = await prisma.newsArticle.findMany({
      where: conditions,
      orderBy: { updatedAt: "desc" },
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
        updatedBy: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({ articles });
  } catch (error) {
    const response = permissionResponse(error);
    if (response) return response;

    console.error("GET /api/news error:", error);

    return NextResponse.json(
      { error: "Unable to load news articles." },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requirePermission("content.create");

    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!newsModelAvailable()) {
      return databaseUnavailableResponse();
    }

    let body: Record<string, unknown>;

    try {
      const parsed: unknown = await request.json();

      if (
        !parsed ||
        typeof parsed !== "object" ||
        Array.isArray(parsed)
      ) {
        return NextResponse.json(
          { error: "Invalid request body." },
          { status: 400 },
        );
      }

      body = parsed as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { error: "Request body must contain valid JSON." },
        { status: 400 },
      );
    }

    const title = optionalString(body.title);
    const excerpt = optionalString(body.excerpt);
    const rawContent =
      typeof body.content === "string" ? body.content : "";

    if (!title || !excerpt || !rawContent.trim()) {
      return NextResponse.json(
        {
          error:
            "Title, excerpt, and article content are required.",
        },
        { status: 400 },
      );
    }

    const category = getNewsCategory(body.category) ?? "NEWS";
    const status = getContentStatus(body.status) ?? "DRAFT";

    const requestedSlug = slugify(
      optionalString(body.slug) ?? title,
    );

    if (!requestedSlug) {
      return NextResponse.json(
        {
          error: "Please provide a valid article title or slug.",
        },
        { status: 400 },
      );
    }

    const existing = await prisma.newsArticle.findFirst({
      where: { slug: requestedSlug },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "That slug is already in use. Choose another slug.",
        },
        { status: 409 },
      );
    }

    const imageUrlInput = optionalString(body.imageUrl);
    const imageUrl = validHttpUrl(imageUrlInput);

    if (imageUrlInput && !imageUrl) {
      return NextResponse.json(
        {
          error:
            "The image URL must be a valid HTTP or HTTPS URL.",
        },
        { status: 400 },
      );
    }

    const now = new Date();

    const article = await prisma.newsArticle.create({
      data: {
        title,
        slug: requestedSlug,
        excerpt,
        content: sanitizeNewsHtml(rawContent),
        category,
        status,
        imageUrl,
        imageAlt: optionalString(body.imageAlt),
        location: optionalString(body.location),
        isFeatured: body.isFeatured === true,
        publishedAt: status === "PUBLISHED" ? now : null,
        seoTitle: optionalString(body.seoTitle),
        seoDescription: optionalString(body.seoDescription),
        createdById: user.id,
        updatedById: user.id,
      },
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    const response = permissionResponse(error);
    if (response) return response;

    const message = errorMessage(error);

    if (
      message.includes("Unique constraint") ||
      message.includes("P2002")
    ) {
      return NextResponse.json(
        {
          error:
            "That article slug is already in use. Choose another slug.",
        },
        { status: 409 },
      );
    }

    console.error("POST /api/news error:", error);

    return NextResponse.json(
      { error: "Unable to create the news article." },
      { status: 500 },
    );
  }
}
