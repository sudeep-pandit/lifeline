import { NextRequest, NextResponse } from "next/server";

import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

function createSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  try {
    await requirePermission("media.view");

    const folders = await prisma.mediaFolder.findMany({
      orderBy: [
        { parentId: "asc" },
        { name: "asc" },
      ],
      include: {
        _count: {
          select: {
            media: true,
            children: true,
          },
        },
      },
    });

    return NextResponse.json({
      folders,
    });
  } catch (error) {
    console.error(
      "GET /api/media/folders error:",
      error,
    );

    const message =
      error instanceof Error ? error.message : "";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    if (message === "FORBIDDEN") {
      return NextResponse.json(
        {
          error:
            "You do not have permission to view folders.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to load folders.",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    await requirePermission("media.edit");

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const parentId =
      typeof body.parentId === "string" &&
      body.parentId
        ? body.parentId
        : null;

    if (!name) {
      return NextResponse.json(
        {
          error: "Folder name is required.",
        },
        { status: 400 },
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          error: "Folder name is too long.",
        },
        { status: 400 },
      );
    }

    if (parentId) {
      const parent =
        await prisma.mediaFolder.findUnique({
          where: {
            id: parentId,
          },
        });

      if (!parent) {
        return NextResponse.json(
          {
            error: "Parent folder not found.",
          },
          { status: 404 },
        );
      }
    }

    const baseSlug = createSlug(name);

    if (!baseSlug) {
      return NextResponse.json(
        {
          error: "Invalid folder name.",
        },
        { status: 400 },
      );
    }

    let slug = baseSlug;
    let counter = 2;

    while (true) {
      const existing =
        await prisma.mediaFolder.findUnique({
          where: {
            slug,
          },
        });

      if (!existing) break;

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const folder =
      await prisma.mediaFolder.create({
        data: {
          name,
          slug,
          parentId,
        },
        include: {
          _count: {
            select: {
              media: true,
              children: true,
            },
          },
        },
      });

    return NextResponse.json(
      {
        message:
          "Folder created successfully.",
        folder,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/media/folders error:",
      error,
    );

    const message =
      error instanceof Error ? error.message : "";

    if (message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 },
      );
    }

    if (message === "FORBIDDEN") {
      return NextResponse.json(
        {
          error:
            "You do not have permission to create folders.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create folder.",
      },
      { status: 500 },
    );
  }
}