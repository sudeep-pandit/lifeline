
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
export const dynamic = "force-dynamic";

function getErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "";

  if (message === "UNAUTHORIZED") {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  if (message === "FORBIDDEN") {
    return NextResponse.json(
      { error: "You do not have permission to access this resource." },
      { status: 403 }
    );
  }

  console.error("Programs API error:", error);

  return NextResponse.json(
    { error: "An unexpected server error occurred." },
    { status: 500 }
  );
}

// GET: Read published programs for the public website.
// Add ?admin=true to request all programs with content.view permission.
export async function GET(request: NextRequest) {
  try {
    const adminView = request.nextUrl.searchParams.get("admin") === "true";

    if (adminView) {
      await requirePermission("content.view");
    }

    const programs = await prisma.contentItem.findMany({
      where: {
        key: { startsWith: "program_" },
        ...(adminView ? {} : { status: "PUBLISHED" }),
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ data: programs });
  } catch (error) {
    return getErrorResponse(error);
  }
}

// POST: Create a program from the admin panel.
export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission("content.create");
    const body = await request.json();

    const title =
      typeof body.title === "string" ? body.title.trim() : "";
    const excerpt =
      typeof body.excerpt === "string" ? body.excerpt.trim() : "";
    const content =
      typeof body.content === "string" ? body.content : "";
    const imageUrl =
      typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";
    const status = body.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
    const sortOrder = Number.isInteger(body.sortOrder) ? body.sortOrder : 0;

    if (!title) {
      return NextResponse.json(
        { error: "Program title is required." },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const key = `program_${slug || Date.now().toString(36)}`;

    const existing = await prisma.contentItem.findFirst({
      where: { key },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A program with this title already exists." },
        { status: 409 }
      );
    }

    const program = await prisma.contentItem.create({
      data: {
        title,
        key,
        slug: `program-${slug || Date.now().toString(36)}`,
        type: "PAGE",
        status,
        excerpt: excerpt || null,
        content: content || null,
        imageUrl: imageUrl || null,
        isHomepage: true,
        isFeatured: Boolean(body.isFeatured),
        sortOrder,
        createdById: user.id,
        updatedById: user.id,
      },
    });

    return NextResponse.json({ data: program }, { status: 201 });
  } catch (error) {
    return getErrorResponse(error);
  }
}
