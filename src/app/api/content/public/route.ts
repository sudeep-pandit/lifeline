
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key")?.trim();

    const content = await prisma.contentItem.findMany({
      where: {
        status: "PUBLISHED",
        ...(key ? { key } : {}),
      },
      orderBy: [
        { sortOrder: "asc" },
        { createdAt: "desc" },
      ],
      select: {
        id: true,
        title: true,
        key: true,
        slug: true,
        type: true,
        excerpt: true,
        content: true,
        imageUrl: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
        isHomepage: true,
        isFeatured: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: key ? content[0] ?? null : content,
    });
  } catch (error) {
    console.error("Public content GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load published content.",
      },
      { status: 500 },
    );
  }
}
