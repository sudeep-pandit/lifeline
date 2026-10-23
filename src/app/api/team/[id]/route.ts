
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function authError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return NextResponse.json(
      { message: "Please log in to continue." },
      { status: 401 },
    );
  }

  if (error instanceof Error && error.message === "FORBIDDEN") {
    return NextResponse.json(
      { message: "You do not have permission to perform this action." },
      { status: 403 },
    );
  }

  return null;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function optionalText(value: unknown): string | null {
  return text(value) || null;
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "team-member"
  );
}

async function uniqueSlug(value: string, excludeId: string) {
  const base = slugify(value);
  let slug = base;
  let suffix = 2;

  while (true) {
    const existing = await prisma.teamMember.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) {
      return slug;
    }

    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requirePermission("team.edit");

    const { id } = await context.params;
    const existing = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Team member not found." },
        { status: 404 },
      );
    }

    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { message: "Invalid request body." },
        { status: 400 },
      );
    }

    const data = body as Record<string, unknown>;

    const updateData: {
      name?: string;
      slug?: string;
      designation?: string;
      department?: string | null;
      bio?: string | null;
      email?: string | null;
      phone?: string | null;
      imageId?: string | null;
      facebook?: string | null;
      instagram?: string | null;
      linkedin?: string | null;
      twitter?: string | null;
      website?: string | null;
      isFeatured?: boolean;
      isActive?: boolean;
      sortOrder?: number;
    } = {};

    if ("name" in data) {
      const name = text(data.name);
      if (!name) {
        return NextResponse.json(
          { message: "Name cannot be empty." },
          { status: 400 },
        );
      }
      updateData.name = name;
    }

    if ("designation" in data) {
      const designation = text(data.designation);
      if (!designation) {
        return NextResponse.json(
          { message: "Designation cannot be empty." },
          { status: 400 },
        );
      }
      updateData.designation = designation;
    }

    if ("slug" in data && text(data.slug)) {
      updateData.slug = await uniqueSlug(text(data.slug), id);
    }

    const optionalFields = [
      "department",
      "bio",
      "email",
      "phone",
      "imageId",
      "facebook",
      "instagram",
      "linkedin",
      "twitter",
      "website",
    ] as const;

    for (const field of optionalFields) {
      if (field in data) {
        updateData[field] = optionalText(data[field]);
      }
    }

    if ("isFeatured" in data) {
      if (typeof data.isFeatured !== "boolean") {
        return NextResponse.json(
          { message: "Featured status must be true or false." },
          { status: 400 },
        );
      }
      updateData.isFeatured = data.isFeatured;
    }

    if ("isActive" in data) {
      if (typeof data.isActive !== "boolean") {
        return NextResponse.json(
          { message: "Active status must be true or false." },
          { status: 400 },
        );
      }
      updateData.isActive = data.isActive;
    }

    if ("sortOrder" in data) {
      if (
        typeof data.sortOrder !== "number" ||
        !Number.isInteger(data.sortOrder)
      ) {
        return NextResponse.json(
          { message: "Display order must be a whole number." },
          { status: 400 },
        );
      }
      updateData.sortOrder = data.sortOrder;
    }

    const member = await prisma.teamMember.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({
      message: "Team member updated successfully.",
      member,
    });
  } catch (error) {
    const response = authError(error);
    if (response) return response;

    console.error("TEAM_UPDATE_ERROR:", error);
    return NextResponse.json(
      { message: "Unable to update team member." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    await requirePermission("team.delete");

    const { id } = await context.params;
    const existing = await prisma.teamMember.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Team member not found." },
        { status: 404 },
      );
    }

    await prisma.teamMember.delete({ where: { id } });

    return NextResponse.json({
      message: "Team member deleted successfully.",
    });
  } catch (error) {
    const response = authError(error);
    if (response) return response;

    console.error("TEAM_DELETE_ERROR:", error);
    return NextResponse.json(
      { message: "Unable to delete team member." },
      { status: 500 },
    );
  }
}
