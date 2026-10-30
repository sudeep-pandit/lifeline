
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

const CATEGORIES = ["ANNUAL", "FINANCIAL", "PROGRAM", "PROJECT"] as const;

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const category = params.get("category");
    const year = params.get("year");
    const search = params.get("search")?.trim();

    const reports = await prisma.report.findMany({
      where: {
        status: "PUBLISHED",
        ...(CATEGORIES.includes(category as (typeof CATEGORIES)[number])
          ? { category: category as (typeof CATEGORIES)[number] }
          : {}),
        ...(year ? { reportYear: year } : {}),
        ...(search ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { reportYear: { contains: search, mode: "insensitive" } },
          ],
        } : {}),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        reportYear: true,
        publishedAt: true,
        isFeatured: true,
        pdfUrl: true,
        pdfName: true,
        pdfSize: true,
        createdAt: true,
      },
      orderBy: [
        { isFeatured: "desc" },
        { sortOrder: "asc" },
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
    });

    const years = await prisma.report.findMany({
      where: { status: "PUBLISHED", reportYear: { not: null } },
      select: { reportYear: true },
      distinct: ["reportYear"],
      orderBy: { reportYear: "desc" },
    });

    return NextResponse.json({
      reports,
      years: years.map((item) => item.reportYear).filter(Boolean),
    }, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    console.error("GET /api/reports/public error:", error);
    return NextResponse.json({ error: "Unable to load published reports." }, { status: 500 });
  }
}
