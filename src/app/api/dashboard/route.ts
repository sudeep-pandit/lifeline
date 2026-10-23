
import { NextResponse } from "next/server";

import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requirePermission("dashboard.view");

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      superAdmins,
      admins,
      editors,
      accountants,
      staff,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.user.count({ where: { role: "SUPER_ADMIN" } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { role: "EDITOR" } }),
      prisma.user.count({ where: { role: "ACCOUNTANT" } }),
      prisma.user.count({ where: { role: "STAFF" } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          totalUsers,
          activeUsers,
          inactiveUsers,
          superAdmins,
          admins,
          editors,
          accountants,
          staff,
          recentUsers,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Dashboard API error:", error);

    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json(
          {
            success: false,
            message: "Your session has expired. Please sign in again.",
          },
          { status: 401 },
        );
      }

      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          {
            success: false,
            message: "You do not have permission to view the dashboard.",
          },
          { status: 403 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard data.",
        ...(process.env.NODE_ENV === "development" &&
        error instanceof Error
          ? { error: error.message }
          : {}),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
