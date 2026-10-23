
import { NextRequest, NextResponse } from "next/server";

import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function handleError(error: unknown, action: string) {
  console.error(`Gallery photos ${action}:`, error);
  const message = error instanceof Error ? error.message : "";

  if (message === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (message === "FORBIDDEN") {
    return NextResponse.json({ error: "Permission denied." }, { status: 403 });
  }
  return NextResponse.json({ error: "Unable to update album photos." }, { status: 500 });
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    await requirePermission("gallery.edit");
    const { id: albumId } = await context.params;
    const body = await request.json();

    const mediaIds: unknown[] = Array.isArray(body.mediaIds) ? body.mediaIds : [];

    if (!mediaIds.length || mediaIds.some((value) => typeof value !== "string")) {
      return NextResponse.json(
        { error: "Select at least one image." },
        { status: 400 },
      );
    }

    const album = await prisma.galleryAlbum.findUnique({
      where: { id: albumId },
      select: { id: true },
    });

    if (!album) {
      return NextResponse.json({ error: "Album not found." }, { status: 404 });
    }

    const uniqueIds = [...new Set(mediaIds as string[])];

    const media = await prisma.media.findMany({
      where: {
        id: { in: uniqueIds },
        mimeType: { startsWith: "image/" },
      },
      select: { id: true },
    });

    if (media.length !== uniqueIds.length) {
      return NextResponse.json(
        { error: "One or more selected images are missing or are not images." },
        { status: 400 },
      );
    }

    const existingPhotos = await prisma.galleryPhoto.findMany({
      where: { albumId },
      select: { mediaId: true, sortOrder: true },
    });

    const existingIds = new Set(existingPhotos.map((photo) => photo.mediaId));
    const nextOrder =
      existingPhotos.reduce((max, photo) => Math.max(max, photo.sortOrder), -1) + 1;

    const newIds = uniqueIds.filter((mediaId) => !existingIds.has(mediaId));

    if (newIds.length) {
      await prisma.galleryPhoto.createMany({
        data: newIds.map((mediaId, index) => ({
          title: "",
          albumId,
          mediaId,
          sortOrder: nextOrder + index,
        })),
      });
    }

    const photos = await prisma.galleryPhoto.findMany({
      where: { albumId },
      include: { media: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({
      photos,
      message: `${newIds.length} photo(s) added to the album.`,
    });
  } catch (error) {
    return handleError(error, "POST");
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    await requirePermission("gallery.edit");
    const { id: albumId } = await context.params;
    const body = await request.json();
    const photoId = typeof body.photoId === "string" ? body.photoId : "";

    if (!photoId) {
      return NextResponse.json({ error: "Photo ID is required." }, { status: 400 });
    }

    const photo = await prisma.galleryPhoto.findFirst({
      where: { id: photoId, albumId },
      select: { id: true },
    });

    if (!photo) {
      return NextResponse.json({ error: "Photo not found in this album." }, { status: 404 });
    }

    await prisma.galleryPhoto.delete({ where: { id: photoId } });

    return NextResponse.json({ message: "Photo removed from album." });
  } catch (error) {
    return handleError(error, "DELETE");
  }
}