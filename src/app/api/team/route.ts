import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

function authError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return NextResponse.json(
      { message: "Please log in to continue." },
      { status: 401 }
    );
  }

  if (error instanceof Error && error.message === "FORBIDDEN") {
    return NextResponse.json(
      { message: "You do not have permission to perform this action." },
      { status: 403 }
    );
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function optionalText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function createUniqueSlug(
  value: string,
  excludeId?: string
): Promise<string> {
  const base = slugify(value) || "team-member";
  let slug = base;
  let counter = 2;

  while (true) {
    const existing = await prisma.teamMember.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) {
      return slug;
    }

    slug = `${base}-${counter}`;
    counter += 1;
  }
}

export async function GET() {
  try {
    await requirePermission("team.view");

    const members = await prisma.teamMember.findMany({
      include: {
        image: {
          select: {
            id: true,
            url: true,
            alt: true,
            originalName: true,
          },
        },
      },
      orderBy: [
        { sortOrder: "asc" },
        { name: "asc" },
      ],
    });

    return NextResponse.json({ members });
  } catch (error) {
    const response = authError(error);
    if (response) return response;

    console.error("GET /api/team failed:", error);

    return NextResponse.json(
      { message: "Unable to load team members." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requirePermission("team.create");

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    if (!isRecord(body)) {
      return NextResponse.json(
        { message: "Invalid request data." },
        { status: 400 }
      );
    }

    const name = optionalText(body.name);
    const designation = optionalText(body.designation);

    if (!name || !designation) {
      return NextResponse.json(
        { message: "Name and designation are required." },
        { status: 400 }
      );
    }

    const imageId = optionalText(body.imageId);

    if (imageId) {
      const image = await prisma.media.findUnique({
        where: { id: imageId },
        select: { id: true },
      });

      if (!image) {
        return NextResponse.json(
          { message: "The selected profile image was not found. Check the Media ID." },
          { status: 400 }
        );
      }
    }

    const requestedSlug = optionalText(body.slug);
    const slug = await createUniqueSlug(requestedSlug || name);

    const sortOrder =
      typeof body.sortOrder === "number" &&
      Number.isInteger(body.sortOrder)
        ? body.sortOrder
        : 0;

    const isActive =
      typeof body.isActive === "boolean" ? body.isActive : true;

    const isFeatured =
      typeof body.isFeatured === "boolean" ? body.isFeatured : false;

    const member = await prisma.teamMember.create({
      data: {
        name,
        slug,
        designation,
        department: optionalText(body.department),
        bio: optionalText(body.bio),
        email: optionalText(body.email),
        phone: optionalText(body.phone),
        imageId,
        facebook: optionalText(body.facebook),
        instagram: optionalText(body.instagram),
        linkedin: optionalText(body.linkedin),
        twitter: optionalText(body.twitter),
        website: optionalText(body.website),
        isActive,
        isFeatured,
        sortOrder,
      },
      include: {
        image: {
          select: {
            id: true,
            url: true,
            alt: true,
            originalName: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Team member created successfully.",
        member,
      },
      { status: 201 }
    );
  } catch (error) {
    const response = authError(error);
    if (response) return response;

    console.error("POST /api/team failed:", error);

    return NextResponse.json(
      { message: "Unable to create team member." },
      { status: 500 }
    );
  }
}
