
import { NextResponse } from "next/server";

import { FinanceTransactionType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorResponse(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function handleError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return errorResponse("Please log in to continue.", 401);
  }

  if (error instanceof Error && error.message === "FORBIDDEN") {
    return errorResponse(
      "You do not have permission to manage finance categories.",
      403,
    );
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  ) {
    return errorResponse(
      "A category with this name and type already exists.",
      409,
    );
  }

  console.error("[FINANCE CATEGORIES API]", error);

  return errorResponse(
    "Unable to process finance categories.",
    500,
  );
}

export async function GET() {
  try {
    await requirePermission("finance.view");

    const categories = await prisma.financeCategory.findMany({
      orderBy: [
        { type: "asc" },
        { sortOrder: "asc" },
        { name: "asc" },
      ],
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    await requirePermission("finance.manageCategories");

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return errorResponse("A valid JSON request body is required.", 400);
    }

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim() || null
        : null;

    const type = body.type;
    const sortOrder = Number(body.sortOrder ?? 0);

    if (name.length < 2 || name.length > 100) {
      return errorResponse(
        "Category name must contain between 2 and 100 characters.",
        400,
      );
    }

    if (
      type !== FinanceTransactionType.INCOME &&
      type !== FinanceTransactionType.EXPENSE
    ) {
      return errorResponse("Select a valid category type.", 400);
    }

    if (
      description !== null &&
      description.length > 2000
    ) {
      return errorResponse(
        "Description must be 2000 characters or fewer.",
        400,
      );
    }

    if (
      !Number.isSafeInteger(sortOrder) ||
      sortOrder < 0 ||
      sortOrder > 10000
    ) {
      return errorResponse(
        "Sort order must be a whole number from 0 to 10000.",
        400,
      );
    }

    const category = await prisma.financeCategory.create({
      data: {
        name,
        type,
        description,
        sortOrder,
        isActive: true,
      },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Finance category created successfully.",
        category,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}
