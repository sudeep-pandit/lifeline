
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type MessageUpdates = {
  isRead?: boolean;
  isImportant?: boolean;
  isArchived?: boolean;
};

function handleError(error: unknown) {
  const code =
    typeof error === "object" && error !== null && "message" in error
      ? String(error.message)
      : "";

  if (code === "UNAUTHORIZED") {
    return NextResponse.json(
      { success: false, message: "Please sign in to continue." },
      { status: 401 },
    );
  }

  if (code === "FORBIDDEN") {
    return NextResponse.json(
      { success: false, message: "You don't have permission to manage messages." },
      { status: 403 },
    );
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  ) {
    return NextResponse.json(
      { success: false, message: "Message not found." },
      { status: 404 },
    );
  }

  console.error("Message detail API error:", error);

  return NextResponse.json(
    { success: false, message: "Unable to process the message request." },
    { status: 500 },
  );
}

// Update read status, importance, or archive status.
export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requirePermission("messages.manage");

    const { id } = await context.params;

    if (!id || id.length > 128) {
      return NextResponse.json(
        { success: false, message: "Invalid message ID." },
        { status: 400 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON request body." },
        { status: 400 },
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid update data." },
        { status: 400 },
      );
    }

    const input = body as Record<string, unknown>;
    const allowedFields = ["isRead", "isImportant", "isArchived"] as const;
    const updates: MessageUpdates = {};

    for (const field of allowedFields) {
      if (field in input) {
        if (typeof input[field] !== "boolean") {
          return NextResponse.json(
            {
              success: false,
              message: `${field} must be true or false.`,
            },
            { status: 400 },
          );
        }

        updates[field] = input[field];
      }
    }

    const unexpectedFields = Object.keys(input).filter(
      (key) => !allowedFields.includes(key as (typeof allowedFields)[number]),
    );

    if (unexpectedFields.length > 0) {
      return NextResponse.json(
        { success: false, message: "Unsupported update field." },
        { status: 400 },
      );
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "No changes were provided." },
        { status: 400 },
      );
    }

    const data: {
      isRead?: boolean;
      isImportant?: boolean;
      isArchived?: boolean;
      readAt?: Date | null;
    } = { ...updates };

    if (typeof updates.isRead === "boolean") {
      data.readAt = updates.isRead ? new Date() : null;
    }

    const message = await prisma.message.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      message: "Message updated successfully.",
      data: message,
    });
  } catch (error) {
    return handleError(error);
  }
}

// Permanently delete a message.
export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requirePermission("messages.manage");

    const { id } = await context.params;

    if (!id || id.length > 128) {
      return NextResponse.json(
        { success: false, message: "Invalid message ID." },
        { status: 400 },
      );
    }

    await prisma.message.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    return handleError(error);
  }
}
