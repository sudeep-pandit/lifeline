
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;

    const album = await prisma.galleryAlbum.findFirst({
      where: {
        slug,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        category: true,
        year: true,
        isFeatured: true,
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
    });

    if (!album) {
      return NextResponse.json(
        { error: "Gallery album not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        album: {
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
          coverAlt: album.coverMedia?.alt ?? album.title,
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
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Public gallery album fetch failed:", error);

    return NextResponse.json(
      { error: "Unable to load the gallery album." },
      { status: 500 },
    );
  }
}
