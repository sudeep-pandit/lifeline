import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import {
  requirePermission,
  PERMISSIONS,
  type Permission,
} from "@/lib/permissions";

const VALID_ROLES = [
  "ADMIN",
  "EDITOR",
  "ACCOUNTANT",
  "STAFF",
] as const;

type CustomPermissionsInput = {
  granted?: unknown;
  revoked?: unknown;
};

function cleanPermissions(
  value: CustomPermissionsInput | null | undefined,
) {
  const granted = Array.isArray(value?.granted)
    ? value.granted.filter(
        (permission): permission is Permission =>
          typeof permission === "string" &&
          Object.values(PERMISSIONS).includes(
            permission as Permission,
          ),
      )
    : [];

  const revoked = Array.isArray(value?.revoked)
    ? value.revoked.filter(
        (permission): permission is Permission =>
          typeof permission === "string" &&
          Object.values(PERMISSIONS).includes(
            permission as Permission,
          ),
      )
    : [];

  return {
    granted: [...new Set(granted)],
    revoked: [...new Set(revoked)],
  };
}

/**
 * GET /api/users
 *
 * Requires:
 * users.view
 */
export async function GET() {
  try {
    await requirePermission(PERMISSIONS.USERS_VIEW);

    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        customPermissions: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("GET_USERS_ERROR:", error);

    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 },
      );
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You do not have permission to view users.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load users.",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/users
 *
 * Requires:
 * users.create
 */
export async function POST(request: Request) {
  try {
    await requirePermission(PERMISSIONS.USERS_CREATE);

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const role =
      typeof body.role === "string"
        ? body.role
        : "STAFF";

    const isActive =
      typeof body.isActive === "boolean"
        ? body.isActive
        : true;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required.",
        },
        { status: 400 },
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
        },
        { status: 400 },
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must contain at least 8 characters.",
        },
        { status: 400 },
      );
    }

    if (
      !VALID_ROLES.includes(
        role as (typeof VALID_ROLES)[number],
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid role.",
        },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A user with this email already exists.",
        },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(
      password,
      12,
    );

    const customPermissions = cleanPermissions(
      body.customPermissions,
    );

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role as
          | "ADMIN"
          | "EDITOR"
          | "ACCOUNTANT"
          | "STAFF",
        customPermissions,
        isActive,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        customPermissions: true,
        isActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully.",
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE_USER_ERROR:", error);

    if (
      error instanceof Error &&
      error.message === "UNAUTHORIZED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 },
      );
    }

    if (
      error instanceof Error &&
      error.message === "FORBIDDEN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You do not have permission to create users.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user.",
      },
      { status: 500 },
    );
  }
}