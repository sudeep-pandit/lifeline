import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

const VALID_FILTERS = [
  "inbox",
  "unread",
  "read",
  "important",
  "archived",
] as const;

type MessageFilter = (typeof VALID_FILTERS)[number];

function permissionError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return NextResponse.json(
      { success: false, message: "Unauthorized." },
      { status: 401 },
    );
  }

  if (error instanceof Error && error.message === "FORBIDDEN") {
    return NextResponse.json(
      {
        success: false,
        message: "You do not have permission to view messages.",
      },
      { status: 403 },
    );
  }

  return null;
}

export async function GET(request: Request) {
  try {
    await requirePermission("messages.view");

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const requestedFilter = searchParams.get("filter") || "inbox";

    if (
      !VALID_FILTERS.includes(requestedFilter as MessageFilter)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid message filter.",
        },
        { status: 400 },
      );
    }

    const filter = requestedFilter as MessageFilter;

    const searchCondition = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              phone: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              subject: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              message: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              enquiryType: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const filterCondition = {
      ...(filter === "inbox" ? { isArchived: false } : {}),
      ...(filter === "unread"
        ? { isRead: false, isArchived: false }
        : {}),
      ...(filter === "read"
        ? { isRead: true, isArchived: false }
        : {}),
      ...(filter === "important" ? { isImportant: true } : {}),
      ...(filter === "archived" ? { isArchived: true } : {}),
    };

    const where = {
      ...searchCondition,
      ...filterCondition,
    };

    const [
      messages,
      total,
      allCount,
      unreadCount,
      importantCount,
      archivedCount,
    ] = await Promise.all([
      prisma.message.findMany({
        where,
        orderBy: [{ createdAt: "desc" }],
        take: 100,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          enquiryType: true,
          subject: true,
          message: true,
          isRead: true,
          isImportant: true,
          isArchived: true,
          readAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),

      // Number of messages matching the selected filter and search.
      prisma.message.count({ where }),

      // All messages, regardless of filter or search.
      prisma.message.count(),

      // Inbox unread messages.
      prisma.message.count({
        where: {
          isRead: false,
          isArchived: false,
        },
      }),

      // All important messages, including archived messages.
      prisma.message.count({
        where: {
          isImportant: true,
        },
      }),

      // All archived messages.
      prisma.message.count({
        where: {
          isArchived: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: messages,
      meta: {
        total,
        allCount,
        limit: 100,
        unreadCount,
        importantCount,
        archivedCount,
      },
    });
  } catch (error) {
    const response = permissionError(error);

    if (response) {
      return response;
    }

    console.error("Messages GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load messages.",
      },
      { status: 500 },
    );
  }
}
