
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import type {
  BloodGroup,
  DonorStatus,
} from "@/generated/prisma/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BLOOD_GROUPS = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
] as const;

const STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED"] as const;

function errorResponse(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return NextResponse.json(
      { success: false, message: "Please sign in to continue." },
      { status: 401 },
    );
  }

  if (error instanceof Error && error.message === "FORBIDDEN") {
    return NextResponse.json(
      { success: false, message: "You do not have permission to perform this action." },
      { status: 403 },
    );
  }

  return null;
}

function text(value: unknown, max = 200) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requirePermission("bloodDonation.view");

    const { id } = await context.params;

    const donor = await prisma.donor.findUnique({
      where: { id },
      select: {
        id: true,
        donorCode: true,
        fullName: true,
        phone: true,
        email: true,
        dateOfBirth: true,
        bloodGroup: true,
        district: true,
        province: true,
        address: true,
        status: true,
        isVerified: true,
        consentGiven: true,
        lastDonationAt: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        donations: {
          orderBy: { donationDate: "desc" },
          take: 20,
          select: {
            id: true,
            donationDate: true,
            donationCenter: true,
            unitsDonated: true,
            bloodRequestId: true,
          },
        },
      },
    });

    if (!donor) {
      return NextResponse.json(
        { success: false, message: "Donor not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: donor });
  } catch (error) {
    const response = errorResponse(error);
    if (response) return response;

    console.error("Donor GET error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load donor." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body: unknown = await request.json().catch(() => null);

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { success: false, message: "Invalid request body." },
        { status: 400 },
      );
    }

    const input = body as Record<string, unknown>;

    // Verification is a privileged action, distinct from normal editing.
    const isVerificationChange =
      Object.prototype.hasOwnProperty.call(input, "isVerified");

    const user = await requirePermission(
      isVerificationChange
        ? "bloodDonation.manage"
        : "bloodDonation.edit",
    );

    const existing = await prisma.donor.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Donor not found." },
        { status: 404 },
      );
    }

    const data: Record<string, unknown> = {};

    if (isVerificationChange) {
      if (typeof input.isVerified !== "boolean") {
        return NextResponse.json(
          { success: false, message: "Invalid verification value." },
          { status: 400 },
        );
      }

      data.isVerified = input.isVerified;
    }

    if ("fullName" in input) {
      const value = text(input.fullName, 120);
      if (!value) {
        return NextResponse.json(
          { success: false, message: "Name is required." },
          { status: 400 },
        );
      }
      data.fullName = value;
    }

    if ("phone" in input) {
      const value = text(input.phone, 30);
      if (value.length < 7) {
        return NextResponse.json(
          { success: false, message: "Enter a valid phone number." },
          { status: 400 },
        );
      }
      data.phone = value;
    }

    if ("email" in input) {
      const value = text(input.email, 254).toLowerCase();
      if (value && !validEmail(value)) {
        return NextResponse.json(
          { success: false, message: "Enter a valid email address." },
          { status: 400 },
        );
      }
      data.email = value || null;
    }

    if ("bloodGroup" in input) {
      if (
        typeof input.bloodGroup !== "string" ||
        !BLOOD_GROUPS.includes(input.bloodGroup as (typeof BLOOD_GROUPS)[number])
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid blood group." },
          { status: 400 },
        );
      }
      data.bloodGroup = input.bloodGroup as BloodGroup;
    }

    if ("status" in input) {
      if (
        typeof input.status !== "string" ||
        !STATUSES.includes(input.status as (typeof STATUSES)[number])
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid donor status." },
          { status: 400 },
        );
      }
      data.status = input.status as DonorStatus;
    }

    if ("district" in input) {
      const value = text(input.district, 100);
      if (!value) {
        return NextResponse.json(
          { success: false, message: "District is required." },
          { status: 400 },
        );
      }
      data.district = value;
    }

    if ("province" in input) {
      data.province = text(input.province, 100) || null;
    }

    if ("address" in input) {
      data.address = text(input.address, 300) || null;
    }

    if ("notes" in input) {
      data.notes =
        typeof input.notes === "string"
          ? input.notes.trim().slice(0, 3000) || null
          : null;
    }

    if ("consentGiven" in input) {
      if (typeof input.consentGiven !== "boolean") {
        return NextResponse.json(
          { success: false, message: "Invalid consent value." },
          { status: 400 },
        );
      }
      data.consentGiven = input.consentGiven;
    }

    if ("dateOfBirth" in input) {
      if (input.dateOfBirth === null || input.dateOfBirth === "") {
        data.dateOfBirth = null;
      } else if (typeof input.dateOfBirth === "string") {
        const date = new Date(input.dateOfBirth);
        if (Number.isNaN(date.getTime()) || date.getTime() > Date.now()) {
          return NextResponse.json(
            { success: false, message: "Invalid date of birth." },
            { status: 400 },
          );
        }
        data.dateOfBirth = date;
      } else {
        return NextResponse.json(
          { success: false, message: "Invalid date of birth." },
          { status: 400 },
        );
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid changes provided." },
        { status: 400 },
      );
    }

    // Keep the authenticated user lookup above; verification actions are
    // permission-gated and never accepted from an untrusted client.
    void user;

    const donor = await prisma.donor.update({
      where: { id },
      data,
      select: {
        id: true,
        donorCode: true,
        fullName: true,
        phone: true,
        email: true,
        bloodGroup: true,
        district: true,
        province: true,
        status: true,
        isVerified: true,
        consentGiven: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Donor updated successfully.",
      data: donor,
    });
  } catch (error) {
    const response = errorResponse(error);
    if (response) return response;

    console.error("Donor PATCH error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update donor." },
      { status: 500 },
    );
  }
}
