
import { NextResponse } from "next/server";
import { FinanceTransactionType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function handleError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return NextResponse.json(
      { error: "Please log in to continue." },
      { status: 401 },
    );
  }

  if (error instanceof Error && error.message === "FORBIDDEN") {
    return NextResponse.json(
      { error: "You do not have permission to manage finance categories." },
      { status: 403 },
    );
  }

  console.error("[FINANCE CATEGORIES API]", error);

  return NextResponse.json(
    { error: "Unable to process finance categories." },
    { status: 500 },
  );
}

// GET: List all finance categories
export async function GET() {
  try {
    await requirePermission("finance.view");

    const categories = await prisma.financeCategory.findMany({
      orderBy: [{ type: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
      include: {
        _count: {
          select: { transactions: true },
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    return handleError(error);
  }
}

// POST: Create a finance category
export async function POST(request: Request) {
  try {
    await requirePermission("finance.manageCategories");

    const body = await request.json();

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim() || null
        : null;

    const type = body.type;
    const sortOrder = Number(body.sortOrder ?? 0);

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: "Category name must contain between 2 and 100 characters." },
        { status: 400 },
      );
    }

    if (
      type !== FinanceTransactionType.INCOME &&
      type !== FinanceTransactionType.EXPENSE
    ) {
      return NextResponse.json(
        { error: "Select a valid category type." },
        { status: 400 },
      );
    }

    if (
      !Number.isInteger(sortOrder) ||
      sortOrder < 0 ||
      sortOrder > 10000
    ) {
      return NextResponse.json(
        { error: "Sort order must be a whole number from 0 to 10000." },
        { status: 400 },
      );
    }

    const existing = await prisma.financeCategory.findUnique({
      where: {
        name_type: { name, type },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A category with this name and type already exists." },
        { status: 409 },
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
    });

    return NextResponse.json(
      {
        message: "Finance category created successfully.",
        category,
      },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}
