import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const BRANDING_KEY = "organization_branding";

function handleError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { success: false, message: "Please log in." },
        { status: 401 },
      );
    }

    if (error.message === "FORBIDDEN") {
      return NextResponse.json(
        { success: false, message: "You do not have permission." },
        { status: 403 },
      );
    }
  }

  console.error("Organization branding API error:", error);

  return NextResponse.json(
    {
      success: false,
      message: "Unable to process organization branding settings.",
    },
    { status: 500 },
  );
}

export async function GET() {
  try {
    await requirePermission("settings.view");

    const branding = await prisma.contentItem.findUnique({
      where: { key: BRANDING_KEY },
      select: {
        imageUrl: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        logoUrl: branding?.imageUrl ?? null,
        updatedAt: branding?.updatedAt ?? null,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requirePermission("settings.edit");
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body) ||
      !("logoUrl" in body)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid branding request." },
        { status: 400 },
      );
    }

    const logoUrl = body.logoUrl;

    if (
      logoUrl !== null &&
      (
        typeof logoUrl !== "string" ||
        logoUrl.length > 1000 ||
        !(
          logoUrl.startsWith("/uploads/media/") ||
          /^https:\/\/[^\s]+$/i.test(logoUrl)
        )
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid logo URL or null to remove it.",
        },
        { status: 400 },
      );
    }

    const branding = await prisma.contentItem.upsert({
      where: { key: BRANDING_KEY },
      update: {
        imageUrl: logoUrl,
        updatedById: user.id,
      },
      create: {
        title: "Organization Branding",
        key: BRANDING_KEY,
        type: "SECTION",
        status: "PUBLISHED",
        imageUrl: logoUrl,
        createdById: user.id,
        updatedById: user.id,
      },
      select: {
        imageUrl: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: logoUrl
        ? "Organization logo saved successfully."
        : "Organization logo removed successfully.",
      data: {
        logoUrl: branding.imageUrl,
        updatedAt: branding.updatedAt,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
