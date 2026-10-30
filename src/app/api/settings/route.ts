
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export const runtime = "nodejs";
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

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { success: false, message },
    { status }
  );
}

function errorResponse(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return jsonError("Please log in.", 401);
    }

    if (error.message === "FORBIDDEN") {
      return jsonError("You do not have permission.", 403);
    }
  }

  console.error("Settings API error:", error);

  return jsonError("Unable to process settings.", 500);
}

function isSettingKey(value: unknown): value is SettingKey {
  return (
    typeof value === "string" &&
    ALLOWED_KEYS.some((key) => key === value)
  );
}

function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);

  return (
    prototype === Object.prototype ||
    prototype === null
  );
}

function validateValue(value: unknown): value is Record<string, unknown> {
  if (!isPlainObject(value)) {
    return false;
  }

  try {
    const serialized = JSON.stringify(value);

    if (
      typeof serialized !== "string" ||
      serialized.length > MAX_JSON_LENGTH
    ) {
      return false;
    }

    // Reject values that cannot be represented safely in JSON.
    const parsed: unknown = JSON.parse(serialized);

    return isPlainObject(parsed);
  } catch {
    return false;
  }
}

async function readRequestBody(
  request: Request
): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
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

    const body = await readRequestBody(request);

    if (body === null || !isPlainObject(body)) {
      return jsonError("Invalid JSON request body.", 400);
    }

    const { key, value } = body;

    if (!isSettingKey(key)) {
      return jsonError("Unsupported settings section.", 400);
    }

    if (!validateValue(value)) {
      return jsonError(
        "Settings must be a valid JSON object under 20 KB.",
        400
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
