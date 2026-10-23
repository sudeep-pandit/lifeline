
import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await destroySession();

    return NextResponse.json(
      {
        success: true,
        message: "Logged out successfully.",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("Logout API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to sign out. Please try again.",
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
