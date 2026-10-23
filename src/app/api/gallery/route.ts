
import { NextRequest, NextResponse } from "next/server";

import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function handleError(error: unknown, action: string) {
  console.error(`Gallery API ${action}:`, error);
  const message = error instanceof Error ? error.message : "";

  if (message === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (message === "FORBIDDEN") {
    return NextResponse.json({ error: "Permission denied." }, { status: 403 });
  }
  return NextResponse.json({ error: "Gallery request failed." }, { status: 500 });
}

export async function GET() {
  try {
    await requirePermission("gallery.view");

    const albums = await prisma.galleryAlbum.findMany({
      include: {
        coverMedia: true,
        photos: {
          include: { media: true },
          orderBy: { sortOrder: "asc" },
        },
        _count: { select: { photos: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    });

    return NextResponse.json({ albums });
  } catch (error) {
    return handleError(error, "GET");
  }
}

export async function POST(request: NextRequest) {
  try {
    await requirePermission("gallery.create");

    const body = await request.json();
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const category =
      typeof body.category === "string" ? body.category.trim() : "";
    const year = typeof body.year === "string" ? body.year.trim() : "";

    if (!title || !category || !year) {
      return NextResponse.json(
        { error: "Album title, category, and year are required." },
        { status: 400 },
      );
    }

    if (title.length > 160 || category.length > 80 || year.length > 20) {
      return NextResponse.json(
        { error: "One or more fields exceed the allowed length." },
        { status: 400 },
      );
    }

    const baseSlug = slugify(
      typeof body.slug === "string" && body.slug.trim()
        ? body.slug
        : title,
    );

    if (!baseSlug) {
      return NextResponse.json(
        { error: "Please provide a valid album title or slug." },
        { status: 400 },
      );
    }

    let slug = baseSlug;
    let suffix = 2;

    while (await prisma.galleryAlbum.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const coverMediaId =
      typeof body.coverMediaId === "string" && body.coverMediaId.trim()
        ? body.coverMediaId.trim()
        : null;

    if (coverMediaId) {
      const cover = await prisma.media.findUnique({
        where: { id: coverMediaId },
        select: { id: true, mimeType: true },
      });

      if (!cover || !cover.mimeType.startsWith("image/")) {
        return NextResponse.json(
          { error: "The selected cover image is not valid." },
          { status: 400 },
        );
      }
    }

    const album = await prisma.galleryAlbum.create({
      data: {
        title,
        slug,
        category,
        year,
        description:
          typeof body.description === "string"
            ? body.description.trim() || null
            : null,
        coverMediaId,
        status: body.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
        sortOrder: Number.isFinite(Number(body.sortOrder))
          ? Math.max(0, Math.floor(Number(body.sortOrder)))
          : 0,
      },
      include: { coverMedia: true, photos: true, _count: { select: { photos: true } } },
    });

    return NextResponse.json(
      { album, message: "Gallery album created successfully." },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "POST");
  }
}
