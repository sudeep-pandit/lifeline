
import { NextRequest, NextResponse } from "next/server";
import {
  FinanceAuditAction,
  FinanceTransactionStatus,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TransactionAction =
  | "submit"
  | "approve"
  | "reject"
  | "mark-paid";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const actionConfig = {
  submit: {
    permission: "finance.submit",
    from: FinanceTransactionStatus.DRAFT,
    to: FinanceTransactionStatus.SUBMITTED,
    audit: FinanceAuditAction.SUBMITTED,
  },
  approve: {
    permission: "finance.approve",
    from: FinanceTransactionStatus.SUBMITTED,
    to: FinanceTransactionStatus.APPROVED,
    audit: FinanceAuditAction.APPROVED,
  },
  reject: {
    permission: "finance.reject",
    from: FinanceTransactionStatus.SUBMITTED,
    to: FinanceTransactionStatus.REJECTED,
    audit: FinanceAuditAction.REJECTED,
  },
  "mark-paid": {
    permission: "finance.markPaid",
    from: FinanceTransactionStatus.APPROVED,
    to: FinanceTransactionStatus.PAID,
    audit: FinanceAuditAction.MARKED_PAID,
  },
} as const;

function respond(
  message: string,
  status = 400,
  extra: Record<string, unknown> = {},
) {
  return NextResponse.json(
    { success: false, message, ...extra },
    { status },
  );
}

function getMessage(error: unknown) {
  return error instanceof Error ? error.message : "";
}

function isPrismaError(error: unknown, code: string) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === code
  );
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    // Require an authenticated, active user.
    const user = await getSessionUser();

    if (!user) {
      return respond("Please sign in to continue.", 401);
    }

    if (!user.isActive) {
      return respond("Your account is inactive.", 403);
    }

    const { id } = await context.params;

    if (!id?.trim()) {
      return respond("A transaction ID is required.", 400);
    }

    // Parse and validate the JSON body.
    const body: unknown = await request.json().catch(() => null);

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      !("action" in body) ||
      typeof body.action !== "string"
    ) {
      return respond("A valid action is required.", 400);
    }

    const action = body.action as TransactionAction;

    if (!Object.prototype.hasOwnProperty.call(actionConfig, action)) {
      return respond(
        "Unsupported action. Use submit, approve, reject, or mark-paid.",
        400,
      );
    }

    const config = actionConfig[action];

    let reason: string | null = null;

    if (action === "reject") {
      const suppliedReason =
        "reason" in body ? body.reason : undefined;

      if (
        typeof suppliedReason !== "string" ||
        !suppliedReason.trim()
      ) {
        return respond(
          "A rejection reason is required.",
          400,
        );
      }

      reason = suppliedReason.trim();

      if (reason.length > 1000) {
        return respond(
          "The rejection reason cannot exceed 1000 characters.",
          400,
        );
      }
    }

    // Keep the project's existing permission system.
    try {
      await requirePermission(config.permission);
    } catch (error) {
      const message = getMessage(error);

      if (message === "UNAUTHORIZED") {
        return respond("Please sign in to continue.", 401);
      }

      if (message === "FORBIDDEN") {
        return respond(
          "You do not have permission to perform this action.",
          403,
        );
      }

      throw error;
    }

    const transaction = await prisma.$transaction(async (tx) => {
      const existing = await tx.financeTransaction.findUnique({
        where: { id },
        select: {
          id: true,
          referenceNumber: true,
          title: true,
          status: true,
        },
      });

      if (!existing) {
        throw new Error("TRANSACTION_NOT_FOUND");
      }

      if (existing.status !== config.from) {
        throw new Error("INVALID_STATUS_TRANSITION");
      }

      // Only update if the transaction still has the expected status.
      // This prevents duplicate or conflicting concurrent actions.
      const updated = await tx.financeTransaction.updateMany({
        where: {
          id,
          status: config.from,
        },
        data: {
          status: config.to,
          ...(action === "approve"
            ? {
                approvedById: user.id,
                approvedAt: new Date(),
                approvalNote: null,
              }
            : {}),
          ...(action === "reject"
            ? { approvalNote: reason }
            : {}),
          ...(action === "mark-paid"
            ? {
                paidById: user.id,
                paidAt: new Date(),
              }
            : {}),
        },
      });

      if (updated.count !== 1) {
        throw new Error("INVALID_STATUS_TRANSITION");
      }

      await tx.financeAuditLog.create({
        data: {
          transactionId: id,
          actorId: user.id,
          action: config.audit,
          details: {
            action,
            previousStatus: existing.status,
            newStatus: config.to,
            referenceNumber: existing.referenceNumber,
            ...(reason ? { reason } : {}),
          },
        },
      });

      return tx.financeTransaction.findUniqueOrThrow({
        where: { id },
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
    });

    return NextResponse.json({
      success: true,
      message: `Transaction ${action.replace("-", " ")} completed successfully.`,
      transaction,
    });
  } catch (error) {
    const message = getMessage(error);

    if (message === "UNAUTHORIZED") {
      return respond("Please sign in to continue.", 401);
    }

    if (message === "FORBIDDEN") {
      return respond(
        "You do not have permission to perform this action.",
        403,
      );
    }

    if (message === "TRANSACTION_NOT_FOUND") {
      return respond("Transaction not found.", 404);
    }

    if (message === "INVALID_STATUS_TRANSITION") {
      return respond(
        "This transaction's status has changed or it is not eligible for this action. Refresh and try again.",
        409,
      );
    }

    if (isPrismaError(error, "P2025")) {
      return respond("Transaction not found.", 404);
    }

    console.error("[BILLING ACTION API]", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process the transaction action.",
        ...(process.env.NODE_ENV === "development" && error instanceof Error
          ? { details: error.message }
          : {}),
      },
      { status: 500 },
    );
  }
}
