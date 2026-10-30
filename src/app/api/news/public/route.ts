
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getNewsCategory } from "@/lib/news";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const search = params.get("search")?.trim() ?? "";
    const category = getNewsCategory(params.get("category"));
    const featured = params.get("featured");
    const requestedLimit = Number(params.get("limit") ?? 12);

    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(Math.floor(requestedLimit), 1), 50)
      : 12;

    const now = new Date();

    const articles = await prisma.newsArticle.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { lte: now },
        ...(category ? { category } : {}),
        ...(featured === "true" ? { isFeatured: true } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { excerpt: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: [
        { isFeatured: "desc" },
        { publishedAt: "desc" },
      ],
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        imageUrl: true,
        imageAlt: true,
        location: true,
        isFeatured: true,
        publishedAt: true,
        seoTitle: true,
        seoDescription: true,
      },
    });

    return NextResponse.json(
      { articles },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.error("GET /api/news/public error:", error);

    return NextResponse.json(
      { error: "Unable to load published news." },
      { status: 500 },
    );
  }
}
