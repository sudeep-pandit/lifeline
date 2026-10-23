import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export const dynamic = "force-dynamic";

const ALLOWED_KEYS = [
  "organization_information",
  "contact_social",
  "website_configuration",
  "notification_preferences",
  "blood_donation_settings",
] as const;

type SettingKey = (typeof ALLOWED_KEYS)[number];

const MAX_JSON_LENGTH = 20_000;

function errorResponse(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return NextResponse.json(
      { success: false, message: "Please log in." },
      { status: 401 }
    );
  }

  if (error instanceof Error && error.message === "FORBIDDEN") {
    return NextResponse.json(
      { success: false, message: "You do not have permission." },
      { status: 403 }
    );
  }

  console.error("Settings API error:", error);

  return NextResponse.json(
    { success: false, message: "Unable to process settings." },
    { status: 500 }
  );
}

function isSettingKey(value: unknown): value is SettingKey {
  return (
    typeof value === "string" &&
    ALLOWED_KEYS.includes(value as SettingKey)
  );
}

function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return prototype === Object.prototype || prototype === null;
}

function validateValue(value: unknown): boolean {
  if (!isPlainObject(value)) {
    return false;
  }

  try {
    const serialized = JSON.stringify(value);

    return (
      typeof serialized === "string" &&
      serialized.length <= MAX_JSON_LENGTH &&
      !serialized.includes("\u0000")
    );
  } catch {
    return false;
  }
}

export async function GET() {
  try {
    await requirePermission("settings.view");

    const settings = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: [...ALLOWED_KEYS],
        },
      },
      select: {
        key: true,
        value: true,
        updatedAt: true,
      },
    });

    const data: Partial<Record<SettingKey, Prisma.JsonValue>> = {};

    for (const setting of settings) {
      if (isSettingKey(setting.key)) {
        data[setting.key] = setting.value;
      }
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requirePermission("settings.edit");
    const body: unknown = await request.json();

    if (!isPlainObject(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 }
      );
    }

    const { key, value } = body;

    if (!isSettingKey(key)) {
      return NextResponse.json(
        { success: false, message: "Unsupported settings section." },
        { status: 400 }
      );
    }

    if (!validateValue(value)) {
      return NextResponse.json(
        {
          success: false,
          message: "Settings must be a valid object under 20 KB.",
        },
        { status: 400 }
      );
    }

    const saved = await prisma.systemSetting.upsert({
      where: { key },
      update: {
        value: value as Prisma.InputJsonValue,
        updatedById: user.id,
      },
      create: {
        key,
        value: value as Prisma.InputJsonValue,
        updatedById: user.id,
        description: `Management settings: ${key}`,
      },
      select: {
        key: true,
        value: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully.",
      data: saved,
    });
  } catch (error) {
    return errorResponse(error);
  }
}