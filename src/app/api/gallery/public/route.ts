
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const albums = await prisma.galleryAlbum.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        category: true,
        year: true,
        sortOrder: true,
        isFeatured: true,
        updatedAt: true,
        coverMedia: {
          select: {
            url: true,
            alt: true,
          },
        },
        photos: {
          select: {
            id: true,
            title: true,
            sortOrder: true,
            media: {
              select: {
                url: true,
                alt: true,
                originalName: true,
              },
            },
          },
          orderBy: [
            { sortOrder: "asc" },
            { createdAt: "asc" },
          ],
        },
        _count: {
          select: {
            photos: true,
          },
        },
      },
      orderBy: [
        { sortOrder: "asc" },
        { updatedAt: "desc" },
      ],
    });

    const result = albums.map((album) => ({
      id: album.id,
      slug: album.slug,
      title: album.title,
      description: album.description ?? "",
      category: album.category,
      year: album.year,
      isFeatured: album.isFeatured,
      cover:
        album.coverMedia?.url ??
        album.photos[0]?.media.url ??
        null,
      coverAlt:
        album.coverMedia?.alt ??
        album.title,
      imageCount: album._count.photos,
      images: album.photos.map((photo) => ({
        id: photo.id,
        title:
          photo.title.trim() ||
          photo.media.alt ||
          photo.media.originalName,
        image: photo.media.url,
        alt: photo.media.alt ?? photo.title ?? album.title,
      })),
    }));

    return NextResponse.json(
      { albums: result },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Public gallery fetch failed:", error);

    return NextResponse.json(
      { error: "Unable to load the gallery." },
      { status: 500 },
    );
  }
}
