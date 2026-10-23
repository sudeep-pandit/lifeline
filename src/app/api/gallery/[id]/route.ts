
import { NextRequest, NextResponse } from "next/server";

import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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
  console.error(`Gallery album ${action}:`, error);
  const message = error instanceof Error ? error.message : "";

  if (message === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (message === "FORBIDDEN") {
    return NextResponse.json({ error: "Permission denied." }, { status: 403 });
  }
  return NextResponse.json({ error: "Unable to process the album." }, { status: 500 });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    await requirePermission("gallery.edit");
    const { id } = await context.params;
    const body = await request.json();

    const existing = await prisma.galleryAlbum.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Album not found." }, { status: 404 });
    }

    const data: {
      title?: string;
      slug?: string;
      description?: string | null;
      category?: string;
      year?: string;
      status?: "DRAFT" | "PUBLISHED";
      sortOrder?: number;
      coverMediaId?: string | null;
    } = {};

    if (typeof body.title === "string") {
      const title = body.title.trim();
      if (!title || title.length > 160) {
        return NextResponse.json({ error: "Enter a valid album title." }, { status: 400 });
      }
      data.title = title;
    }

    if (typeof body.slug === "string" || typeof body.title === "string") {
      const requestedSlug = typeof body.slug === "string" && body.slug.trim()
        ? body.slug
        : body.title ?? existing.title;
      const baseSlug = slugify(requestedSlug);

      if (!baseSlug) {
        return NextResponse.json({ error: "Enter a valid slug." }, { status: 400 });
      }

      let slug = baseSlug;
      let suffix = 2;
      while (true) {
        const match = await prisma.galleryAlbum.findUnique({ where: { slug } });
        if (!match || match.id === id) break;
        slug = `${baseSlug}-${suffix++}`;
      }
      data.slug = slug;
    }

    if (typeof body.description === "string" || body.description === null) {
      data.description =
        typeof body.description === "string" ? body.description.trim() || null : null;
    }

    if (typeof body.category === "string") {
      if (!body.category.trim() || body.category.trim().length > 80) {
        return NextResponse.json({ error: "Enter a valid category." }, { status: 400 });
      }
      data.category = body.category.trim();
    }

    if (typeof body.year === "string") {
      if (!body.year.trim() || body.year.trim().length > 20) {
        return NextResponse.json({ error: "Enter a valid year." }, { status: 400 });
      }
      data.year = body.year.trim();
    }

    if (body.status === "DRAFT" || body.status === "PUBLISHED") {
      data.status = body.status;
    }

    if (body.sortOrder !== undefined) {
      const order = Number(body.sortOrder);
      if (!Number.isFinite(order) || order < 0) {
        return NextResponse.json({ error: "Sort order must be zero or greater." }, { status: 400 });
      }
      data.sortOrder = Math.floor(order);
    }

    if (Object.prototype.hasOwnProperty.call(body, "coverMediaId")) {
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
          return NextResponse.json({ error: "Invalid cover image." }, { status: 400 });
        }
      }

      data.coverMediaId = coverMediaId;
    }

    const album = await prisma.galleryAlbum.update({
      where: { id },
      data,
      include: {
        coverMedia: true,
        photos: { include: { media: true }, orderBy: { sortOrder: "asc" } },
        _count: { select: { photos: true } },
      },
    });

    return NextResponse.json({ album, message: "Album updated successfully." });
  } catch (error) {
    return handleError(error, "PATCH");
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    await requirePermission("gallery.delete");
    const { id } = await context.params;

    const album = await prisma.galleryAlbum.findUnique({ where: { id } });
    if (!album) {
      return NextResponse.json({ error: "Album not found." }, { status: 404 });
    }

    // Cascades to GalleryPhoto records; original Media files are retained.
    await prisma.galleryAlbum.delete({ where: { id } });

    return NextResponse.json({ message: "Gallery album deleted successfully." });
  } catch (error) {
    return handleError(error, "DELETE");
  }
}
