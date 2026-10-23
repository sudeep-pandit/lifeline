import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      where: {
        isActive: true,
      },
      include: {
        image: {
          select: {
            id: true,
            url: true,
            alt: true,
            originalName: true,
          },
        },
      },
      orderBy: [
        { isFeatured: "desc" },
        { sortOrder: "asc" },
        { name: "asc" },
      ],
    });

    return NextResponse.json(
      { members },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/team/public failed:", error);

    return NextResponse.json(
      { message: "Unable to load team members." },
      { status: 500 }
    );
  }
}