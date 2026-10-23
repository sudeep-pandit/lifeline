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
 * PATCH /api/users/[id]
 *
 * Requires users.edit
 */
export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    await requirePermission(PERMISSIONS.USERS_EDIT);

    const { id } = await context.params;

    const body = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 },
      );
    }

    /*
     * Never allow a Super Admin account
     * to be modified through the normal
     * user-management system.
     */
    if (existingUser.role === "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Super Admin accounts cannot be modified here.",
        },
        { status: 403 },
      );
    }

    const data: {
      name?: string;
      email?: string;
      passwordHash?: string;
      role?:
        | "ADMIN"
        | "EDITOR"
        | "ACCOUNTANT"
        | "STAFF";
      customPermissions?: {
        granted: Permission[];
        revoked: Permission[];
      };
      isActive?: boolean;
    } = {};

    if (typeof body.name === "string") {
      const name = body.name.trim();

      if (!name) {
        return NextResponse.json(
          {
            success: false,
            message: "Name cannot be empty.",
          },
          { status: 400 },
        );
      }

      data.name = name;
    }

    if (typeof body.email === "string") {
      const email = body.email.trim().toLowerCase();

      if (!email) {
        return NextResponse.json(
          {
            success: false,
            message: "Email cannot be empty.",
          },
          { status: 400 },
        );
      }

      const emailOwner =
        await prisma.user.findUnique({
          where: {
            email,
          },
        });

      if (
        emailOwner &&
        emailOwner.id !== existingUser.id
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Another user already uses this email.",
          },
          { status: 409 },
        );
      }

      data.email = email;
    }

    if (typeof body.password === "string") {
      if (body.password.length < 8) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Password must contain at least 8 characters.",
          },
          { status: 400 },
        );
      }

      data.passwordHash = await bcrypt.hash(
        body.password,
        12,
      );
    }

    if (typeof body.role === "string") {
      if (
        !VALID_ROLES.includes(
          body.role as (typeof VALID_ROLES)[number],
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

      data.role = body.role as
        | "ADMIN"
        | "EDITOR"
        | "ACCOUNTANT"
        | "STAFF";
    }

    if (
      body.customPermissions &&
      typeof body.customPermissions === "object"
    ) {
      data.customPermissions =
        cleanPermissions(
          body.customPermissions,
        );
    }

    if (typeof body.isActive === "boolean") {
      data.isActive = body.isActive;
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data,
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
      message: "User updated successfully.",
      user,
    });
  } catch (error) {
    console.error("UPDATE_USER_ERROR:", error);

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
            "You do not have permission to edit users.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user.",
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/users/[id]
 *
 * Requires users.delete
 */
export async function DELETE(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    await requirePermission(PERMISSIONS.USERS_DELETE);

    const { id } = await context.params;

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 },
      );
    }

    if (existingUser.role === "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Super Admin accounts cannot be deleted.",
        },
        { status: 403 },
      );
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE_USER_ERROR:", error);

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
            "You do not have permission to delete users.",
        },
        { status: 403 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete user.",
      },
      { status: 500 },
    );
  }
}