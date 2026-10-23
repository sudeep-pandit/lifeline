import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import type {
  FinancePaymentMethod,
  FinanceTransactionType,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TRANSACTION_TYPES = ["INCOME", "EXPENSE"] as const;

const PAYMENT_METHODS = [
  "CASH",
  "BANK_TRANSFER",
  "ESEWA",
  "KHALTI",
  "CONNECT_IPS",
  "CHEQUE",
  "OTHER",
] as const;

type TransactionType = (typeof TRANSACTION_TYPES)[number];
type PaymentMethod = (typeof PAYMENT_METHODS)[number];

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function isTransactionType(
  value: unknown,
): value is TransactionType {
  return (
    typeof value === "string" &&
    TRANSACTION_TYPES.some((item) => item === value)
  );
}

function isPaymentMethod(
  value: unknown,
): value is PaymentMethod {
  return (
    typeof value === "string" &&
    PAYMENT_METHODS.some((item) => item === value)
  );
}

function isValidAmount(value: unknown): value is string {
  if (typeof value !== "string") return false;

  if (!/^(?:0|[1-9]\d{0,11})(?:\.\d{1,2})?$/.test(value)) {
    return false;
  }

  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0;
}

function optionalText(
  value: unknown,
  maximumLength = 2000,
): string | null {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maximumLength) : null;
}

function isValidDate(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    !Number.isNaN(new Date(value).getTime())
  );
}

function errorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status },
    );
  }

  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { error: "Please sign in to continue." },
        { status: 401 },
      );
    }

    if (error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "You do not have permission to perform this action." },
        { status: 403 },
      );
    }
  }

  // Diagnostic logging: inspect the VS Code terminal for the real cause.
  console.error("[BILLING API ERROR]", error);

  return NextResponse.json(
    {
      error: "An unexpected error occurred while processing billing.",
      details:
        process.env.NODE_ENV === "development" &&
        error instanceof Error
          ? error.message
          : undefined,
    },
    { status: 500 },
  );
}

/**
 * GET /api/billing
 * Returns finance summary, active categories, parties, and transactions.
 */
export async function GET() {
  try {
    await requirePermission("finance.view");

    const [
      categories,
      parties,
      transactions,
      income,
      expenses,
      pendingApprovals,
      totalTransactions,
    ] = await Promise.all([
      prisma.financeCategory.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      }),

      prisma.financeParty.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),

      prisma.financeTransaction.findMany({
        take: 100,
        orderBy: [
          { transactionDate: "desc" },
          { createdAt: "desc" },
        ],
        include: {
          category: true,
          party: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),

      prisma.financeTransaction.aggregate({
        where: {
          type: "INCOME",
          status: { in: ["APPROVED", "PAID"] },
        },
        _sum: { amount: true },
      }),

      prisma.financeTransaction.aggregate({
        where: {
          type: "EXPENSE",
          status: { in: ["APPROVED", "PAID"] },
        },
        _sum: { amount: true },
      }),

      prisma.financeTransaction.count({
        where: { status: "SUBMITTED" },
      }),

      prisma.financeTransaction.count({
        where: { status: { not: "CANCELLED" } },
      }),
    ]);

    const totalIncome = Number(income._sum.amount ?? 0);
    const totalExpenses = Number(expenses._sum.amount ?? 0);

    return NextResponse.json({
      summary: {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses,
        pendingApprovals,
        totalTransactions,
      },
      categories,
      parties,
      transactions,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * POST /api/billing
 * Creates a draft transaction and records its audit log.
 */
export async function POST(request: Request) {
  try {
    const user = await requirePermission("finance.create");

    let parsed: unknown;

    try {
      parsed = await request.json();
    } catch {
      throw new ApiError("Invalid JSON request body.", 400);
    }

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      throw new ApiError(
        "The request body must be a JSON object.",
        400,
      );
    }

    const body = parsed as Record<string, unknown>;

    const typeValue = body.type;
    const paymentMethodValue = body.paymentMethod;
    const titleValue = body.title;
    const amountValue = body.amount;
    const transactionDateValue = body.transactionDate;
    const categoryIdValue = body.categoryId;

    if (!isTransactionType(typeValue)) {
      throw new ApiError(
        "Transaction type must be INCOME or EXPENSE.",
        400,
      );
    }

    if (!isPaymentMethod(paymentMethodValue)) {
      throw new ApiError(
        "Please select a valid payment method.",
        400,
      );
    }

    if (
      typeof titleValue !== "string" ||
      !titleValue.trim() ||
      titleValue.trim().length > 200
    ) {
      throw new ApiError(
        "A transaction title is required and must not exceed 200 characters.",
        400,
      );
    }

    if (!isValidAmount(amountValue)) {
      throw new ApiError(
        "Enter a positive amount with no more than two decimal places.",
        400,
      );
    }

    if (!isValidDate(transactionDateValue)) {
      throw new ApiError(
        "Please provide a valid transaction date.",
        400,
      );
    }

    if (
      typeof categoryIdValue !== "string" ||
      !categoryIdValue.trim()
    ) {
      throw new ApiError(
        "Please select a transaction category.",
        400,
      );
    }

    const type: FinanceTransactionType = typeValue;
    const paymentMethod: FinancePaymentMethod = paymentMethodValue;
    const title = titleValue.trim();
    const amount = amountValue;
    const transactionDate = new Date(transactionDateValue);
    const categoryId = categoryIdValue.trim();

    const category = await prisma.financeCategory.findFirst({
      where: {
        id: categoryId,
        isActive: true,
        type,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!category) {
      throw new ApiError(
        "The selected category is inactive or does not match the transaction type.",
        400,
      );
    }

    const partyId =
      typeof body.partyId === "string" && body.partyId.trim()
        ? body.partyId.trim()
        : null;

    if (partyId) {
      const party = await prisma.financeParty.findFirst({
        where: {
          id: partyId,
          isActive: true,
        },
        select: { id: true },
      });

      if (!party) {
        throw new ApiError(
          "The selected party is unavailable.",
          400,
        );
      }
    }

    const description = optionalText(body.description);
    const paymentReference = optionalText(
      body.paymentReference,
      150,
    );
    const notes = optionalText(body.notes);

    const prefix = type === "INCOME" ? "LA-REC" : "LA-VOU";
    const referenceNumber = `${prefix}-${Date.now()}-${randomUUID()
      .slice(0, 8)
      .toUpperCase()}`;

    const transaction = await prisma.$transaction(async (tx) => {
      const created = await tx.financeTransaction.create({
        data: {
          referenceNumber,
          type,
          status: "DRAFT",
          title,
          description,
          amount,
          currency: "NPR",
          transactionDate,
          paymentMethod,
          paymentReference,
          notes,
          category: {
            connect: { id: category.id },
          },
          ...(partyId
            ? {
                party: {
                  connect: { id: partyId },
                },
              }
            : {}),
          createdBy: {
            connect: { id: user.id },
          },
        },
        include: {
          category: true,
          party: true,
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      await tx.financeAuditLog.create({
        data: {
          transaction: {
            connect: { id: created.id },
          },
          actor: {
            connect: { id: user.id },
          },
          action: "CREATED",
          details: {
            referenceNumber,
            type,
            amount,
            currency: "NPR",
            initialStatus: "DRAFT",
          },
        },
      });

      return created;
    });

    return NextResponse.json(
      {
        message: "Draft transaction created successfully.",
        transaction,
      },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
