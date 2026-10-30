
import { NextRequest, NextResponse } from "next/server";
import { ContentStatus, PublicationCategory } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const CATEGORIES = [
  "GUIDE_MANUAL",
  "AWARENESS_MATERIAL",
  "RESEARCH_LEARNING",
  "PUBLICATION",
] as const;

function isCategory(value: string): value is PublicationCategory {
  return CATEGORIES.includes(value as (typeof CATEGORIES)[number]);
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const search = params.get("search")?.trim() ?? "";
    const categoryValue = params.get("category") ?? "";
    const year = params.get("year")?.trim() ?? "";

    if (categoryValue && !isCategory(categoryValue)) {
      return NextResponse.json(
        { message: "Invalid publication category." },
        { status: 400 },
      );
    }

    const publications = await prisma.publication.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        ...(categoryValue ? { category: categoryValue } : {}),
        ...(year ? { publicationYear: year } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                {
                  description: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                { author: { contains: search, mode: "insensitive" } },
                { publisher: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        publicationYear: true,
        language: true,
        publisher: true,
        author: true,
        edition: true,
        isbn: true,
        pdfUrl: true,
        pdfName: true,
        pdfSize: true,
        coverImageUrl: true,
        isFeatured: true,
        publishedAt: true,
      },
      orderBy: [
        { isFeatured: "desc" },
        { sortOrder: "asc" },
        { publishedAt: "desc" },
      ],
    });

    const yearRows = await prisma.publication.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        publicationYear: { not: null },
      },
      select: { publicationYear: true },
      distinct: ["publicationYear"],
      orderBy: { publicationYear: "desc" },
    });

    const years = yearRows
      .map((item) => item.publicationYear)
      .filter((value): value is string => Boolean(value));

    return NextResponse.json({ publications, years });
  } catch (error) {
    console.error("Publications public API error:", error);

    return NextResponse.json(
      { message: "Unable to load publications right now." },
      { status: 500 },
    );
  }
}
