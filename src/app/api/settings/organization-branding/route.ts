import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BRANDING_KEY = "organization_branding";

type BrandingBody = {
  logoUrl: string | null;
};

function errorResponse(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in.",
        },
        { status: 401 },
      );
    }

    if (error.message === "FORBIDDEN") {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to change this setting.",
        },
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

function isValidLogoUrl(value: unknown): value is string | null {
  if (value === null) return true;

  if (typeof value !== "string" || value.length > 1000) {
    return false;
  }

  // Allow URLs served from the application's media upload directory.
  if (value.startsWith("/uploads/media/")) {
    return (
      !value.startsWith("//") &&
      !value.includes("\\") &&
      !value.includes("..") &&
      !/[\u0000-\u001F\u007F]/.test(value)
    );
  }

  // External logo URLs must use HTTPS.
  try {
    const url = new URL(value);

    return (
      url.protocol === "https:" &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
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
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requirePermission("settings.edit");

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Request body must contain valid JSON.",
        },
        { status: 400 },
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body) ||
      !("logoUrl" in body)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid branding request.",
        },
        { status: 400 },
      );
    }

    const logoUrl = (body as BrandingBody).logoUrl;

    if (!isValidLogoUrl(logoUrl)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Provide a valid HTTPS logo URL, an application media URL, or null to remove the logo.",
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
    return errorResponse(error);
  }
}