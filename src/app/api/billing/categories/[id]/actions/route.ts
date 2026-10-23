import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";

type TransactionAction =
  | "submit"
  | "approve"
  | "reject"
  | "mark-paid";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const APPROVER_ROLES = [
  "ACCOUNTANT",
  "ADMIN",
  "SUPER_ADMIN",
] as const;

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { success: false, message },
    { status },
  );
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "An unexpected error occurred.";
}

function isPrismaRecordNotFound(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    // 1. Authenticate the current user.
    const user = await getSessionUser();

    if (!user) {
      return jsonError("Authentication required.", 401);
    }

    // 2. Validate the transaction ID.
    const { id } = await context.params;

    if (!id || !id.trim()) {
      return jsonError("A valid transaction ID is required.", 400);
    }

    // 3. Validate the requested action.
    const body = await request.json().catch(() => null);

    if (
      !body ||
      typeof body.action !== "string"
    ) {
      return jsonError("A valid action is required.", 400);
    }

    const action = body.action as TransactionAction;

    const allowedActions: TransactionAction[] = [
      "submit",
      "approve",
      "reject",
      "mark-paid",
    ];

    if (!allowedActions.includes(action)) {
      return jsonError(
        "Unsupported action. Use submit, approve, reject, or mark-paid.",
        400,
      );
    }

    // 4. Check authorization before modifying any records.
    const role = String(user.role).toUpperCase();

    if (action === "approve" || action === "reject") {
      // Accountants are explicitly allowed to approve and reject
      // under the selected Lifeline Achham approval policy.
      if (
        !APPROVER_ROLES.includes(
          role as (typeof APPROVER_ROLES)[number],
        )
      ) {
        return jsonError(
          "Only Accountants, Admins, and Super Admins can approve or reject transactions.",
          403,
        );
      }
    } else {
      const requiredPermission =
        action === "submit"
          ? "finance.submit"
          : "finance.markPaid";

      try {
        await requirePermission(requiredPermission);
      } catch (error) {
        const message = getErrorMessage(error);

        if (message === "UNAUTHORIZED") {
          return jsonError("Authentication required.", 401);
        }

        if (message === "FORBIDDEN") {
          return jsonError(
            "You do not have permission to perform this action.",
            403,
          );
        }

        throw error;
      }
    }

    // 5. Validate rejection reason.
    let reason: string | null = null;

    if (action === "reject") {
      if (
        typeof body.reason !== "string" ||
        !body.reason.trim()
      ) {
        return jsonError(
          "A reason is required when rejecting a transaction.",
          400,
        );
      }

      reason = body.reason.trim();

if (reason != null && reason.length > 1000)
   {        return jsonError(
          "The rejection reason must be 1000 characters or fewer.",
          400,
        );
      }
    }

    // 6. Apply the status transition and audit log atomically.
    const result = await prisma.$transaction(async (tx) => {
      const transaction =
        await tx.financeTransaction.findUnique({
          where: { id },
          select: {
            id: true,
            referenceNumber: true,
            title: true,
            status: true,
            createdById: true,
          },
        });

      if (!transaction) {
        throw new Error("TRANSACTION_NOT_FOUND");
      }

      let nextStatus: string;
      let auditAction:
        | "SUBMITTED"
        | "APPROVED"
        | "REJECTED"
        | "MARKED_PAID";

      switch (action) {
        case "submit": {
          if (transaction.status !== "DRAFT") {
            throw new Error(
              "Only draft transactions can be submitted.",
            );
          }

          nextStatus = "SUBMITTED";
          auditAction = "SUBMITTED";
          break;
        }

        case "approve": {
          if (transaction.status !== "SUBMITTED") {
            throw new Error(
              "Only submitted transactions can be approved.",
            );
          }

          nextStatus = "APPROVED";
          auditAction = "APPROVED";
          break;
        }

        case "reject": {
          if (transaction.status !== "SUBMITTED") {
            throw new Error(
              "Only submitted transactions can be rejected.",
            );
          }

          nextStatus = "REJECTED";
          auditAction = "REJECTED";
          break;
        }

        case "mark-paid": {
          if (transaction.status !== "APPROVED") {
            throw new Error(
              "Only approved transactions can be marked as paid.",
            );
          }

          nextStatus = "PAID";
          auditAction = "MARKED_PAID";
          break;
        }
      }

      const updateData: Record<string, unknown> = {
        status: nextStatus,
      };

      if (action === "approve") {
        updateData.approverId = user.id;
        updateData.approvedAt = new Date();
      }

      if (action === "mark-paid") {
        updateData.paidById = user.id;
        updateData.paidAt = new Date();
      }

      const updatedTransaction =
        await tx.financeTransaction.update({
          where: { id },
          data: updateData,
        });

      await tx.financeAuditLog.create({
        data: {
          transactionId: id,
          actorId: user.id,
          action: auditAction,
          details: {
            previousStatus: transaction.status,
            newStatus: nextStatus,
            action,
            ...(reason ? { reason } : {}),
          },
        },
      });

      return updatedTransaction;
    });

    return NextResponse.json({
      success: true,
      message: `Transaction ${action.replace("-", " ")} completed successfully.`,
      transaction: result,
    });
  } catch (error) {
    const message = getErrorMessage(error);

    if (message === "UNAUTHORIZED") {
      return jsonError("Authentication required.", 401);
    }

    if (message === "FORBIDDEN") {
      return jsonError(
        "You do not have permission to perform this action.",
        403,
      );
    }

    if (message === "TRANSACTION_NOT_FOUND") {
      return jsonError("Transaction not found.", 404);
    }

    if (
      message === "Only draft transactions can be submitted." ||
      message === "Only submitted transactions can be approved." ||
      message === "Only submitted transactions can be rejected." ||
      message === "Only approved transactions can be marked as paid."
    ) {
      return jsonError(message, 409);
    }

    if (isPrismaRecordNotFound(error)) {
      return jsonError("Transaction not found.", 404);
    }

    console.error("Billing transaction action error:", error);

    return jsonError(
      "Unable to process the transaction action.",
      500,
    );
  }
}