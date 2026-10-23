import { NextResponse } from "next/server";

import { getEffectivePermissions } from "@/lib/permissions";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
          permissions: [],
        },
        { status: 401 },
      );
    }

    const permissions = getEffectivePermissions(
      user.role,
      user.customPermissions,
    );

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
      permissions,
    });
  } catch {
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        permissions: [],
      },
      { status: 401 },
    );
  }
}