
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import type {
  BloodGroup,
  DonorStatus,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const BLOOD_GROUPS = [
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
] as const;

export const DONOR_STATUSES = [
  "ACTIVE",
  "INACTIVE",
  "SUSPENDED",
] as const;

export const NEPAL_PROVINCES = [
  "Koshi Province",
  "Madhesh Province",
  "Bagmati Province",
  "Gandaki Province",
  "Lumbini Province",
  "Karnali Province",
  "Sudurpashchim Province",
] as const;

type JsonObject = Record<string, unknown>;

function jsonError(message: string, status = 400) {
  return NextResponse.json(
    { success: false, message },
    { status },
  );
}

function permissionError(error: unknown) {
  if (
    error instanceof Error &&
    error.message === "UNAUTHORIZED"
  ) {
    return jsonError("Please sign in to continue.", 401);
  }

  if (
    error instanceof Error &&
    error.message === "FORBIDDEN"
  ) {
    return jsonError(
      "You do not have permission to manage donors.",
      403,
    );
  }

  return null;
}

function isJsonObject(value: unknown): value is JsonObject {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function cleanString(value: unknown, maxLength = 200): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isBloodGroup(value: unknown): value is BloodGroup {
  return (
    typeof value === "string" &&
    (BLOOD_GROUPS as readonly string[]).includes(value)
  );
}

function isDonorStatus(value: unknown): value is DonorStatus {
  return (
    typeof value === "string" &&
    (DONOR_STATUSES as readonly string[]).includes(value)
  );
}

function isNepalProvince(
  value: string,
): value is (typeof NEPAL_PROVINCES)[number] {
  return (NEPAL_PROVINCES as readonly string[]).includes(value);
}

function parseWardNumber(value: unknown): number | null {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : NaN;

  return Number.isInteger(parsed) && parsed >= 1 && parsed <= 32
    ? parsed
    : null;
}

/**
 * Checks the YYYY-MM-DD format and basic B.S. date ranges.
 * This does not validate the exact number of days in each
 * Nepali calendar month.
 */
function isValidBSDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  return (
    year >= 1900 &&
    year <= 2200 &&
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= 32
  );
}

/**
 * Returns a Date for a valid Gregorian YYYY-MM-DD date,
 * null if omitted, or undefined if invalid/future-dated.
 */
function parseGregorianDate(
  value: unknown,
): Date | null | undefined {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return undefined;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    date.getTime() > Date.now()
  ) {
    return undefined;
  }

  return date;
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    error.code === "P2002"
  );
}

function isDonorCodeCollision(error: unknown): boolean {
  if (!isUniqueConstraintError(error)) return false;

  const meta =
    error !== null &&
    typeof error === "object" &&
    "meta" in error
      ? error.meta
      : null;

  if (!meta || typeof meta !== "object") return false;

  const target =
    "target" in meta
      ? meta.target
      : undefined;

  const targetText = Array.isArray(target)
    ? target.join(" ").toLowerCase()
    : String(target ?? "").toLowerCase();

  return targetText.includes("donorcode");
}

function makeDonorCode(): string {
  return `LA-D-${randomUUID()
    .replaceAll("-", "")
    .slice(0, 8)
    .toUpperCase()}`;
}

const donorSelect = {
  id: true,
  donorCode: true,
  fullName: true,
  phone: true,
  email: true,
  dateOfBirth: true,
  dateOfBirthBS: true,
  bloodGroup: true,
  province: true,
  district: true,
  localLevel: true,
  wardName: true,
  wardNumber: true,
  address: true,
  status: true,
  isVerified: true,
  consentGiven: true,
  lastDonationAt: true,
  createdAt: true,
} as const;

// ============================================================
// GET /api/donors
// ============================================================

export async function GET(request: Request) {
  try {
    await requirePermission("bloodDonation.view");

    const params = new URL(request.url).searchParams;

    const search = cleanString(params.get("search"), 100);
    const province = cleanString(params.get("province"), 100);
    const district = cleanString(params.get("district"), 100);
    const localLevel = cleanString(params.get("localLevel"), 150);
    const rawBloodGroup = params.get("bloodGroup") || "";
    const rawStatus = params.get("status") || "";

    const requestedPage = Number(params.get("page") ?? 1);
    const requestedPageSize = Number(params.get("pageSize") ?? 10);

    const page = Number.isFinite(requestedPage)
      ? Math.max(1, Math.min(100000, Math.floor(requestedPage)))
      : 1;

    const pageSize = Number.isFinite(requestedPageSize)
      ? Math.max(1, Math.min(50, Math.floor(requestedPageSize)))
      : 10;

    if (province && !isNepalProvince(province)) {
      return jsonError("Invalid province filter.");
    }

    if (rawBloodGroup && !isBloodGroup(rawBloodGroup)) {
      return jsonError("Invalid blood group filter.");
    }

    if (rawStatus && !isDonorStatus(rawStatus)) {
      return jsonError("Invalid donor status filter.");
    }

    const where = {
      ...(province ? { province } : {}),
      ...(rawBloodGroup
        ? { bloodGroup: rawBloodGroup as BloodGroup }
        : {}),
      ...(rawStatus ? { status: rawStatus as DonorStatus } : {}),
      ...(district
        ? {
            district: {
              contains: district,
              mode: "insensitive" as const,
            },
          }
        : {}),
      ...(localLevel
        ? {
            localLevel: {
              contains: localLevel,
              mode: "insensitive" as const,
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              {
                fullName: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                donorCode: {
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
                email: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                province: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                district: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                localLevel: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                wardName: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    };

    const [
      donors,
      total,
      activeCount,
      verifiedCount,
      groupCounts,
    ] = await Promise.all([
      prisma.donor.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: donorSelect,
      }),

      prisma.donor.count({ where }),

      prisma.donor.count({
        where: { status: "ACTIVE" },
      }),

      prisma.donor.count({
        where: { isVerified: true },
      }),

      prisma.donor.groupBy({
        by: ["bloodGroup"],
        _count: { _all: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: donors,
      meta: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
        activeCount,
        verifiedCount,
        bloodGroupCounts: groupCounts.map((item) => ({
          bloodGroup: item.bloodGroup,
          count: item._count._all,
        })),
      },
    });
  } catch (error) {
    const response = permissionError(error);
    if (response) return response;

    console.error("Donors GET error:", error);
    return jsonError("Failed to load donors.", 500);
  }
}

// ============================================================
// POST /api/donors
// ============================================================

export async function POST(request: Request) {
  try {
    const user = await requirePermission("bloodDonation.create");

    const body: unknown = await request.json().catch(() => null);
    if (!isJsonObject(body)) {
      return jsonError("Invalid request body.");
    }

    const fullName = cleanString(body.fullName, 120);
    const phone = cleanString(body.phone, 30);
    const email = cleanString(body.email, 254).toLowerCase();

    const province = cleanString(body.province, 100);
    const district = cleanString(body.district, 100);
    const localLevel = cleanString(body.localLevel, 150);
    const wardName = cleanString(body.wardName, 100);
    const address = cleanString(body.address, 300);
    const notes =
      typeof body.notes === "string"
        ? body.notes.trim().slice(0, 3000)
        : "";

    const bloodGroup = body.bloodGroup;
    const dateOfBirthBS = cleanString(body.dateOfBirthBS, 10);
    const consentGiven = body.consentGiven === true;

    if (
      !fullName ||
      !phone ||
      !province ||
      !district ||
      !localLevel ||
      !wardName ||
      !bloodGroup
    ) {
      return jsonError(
        "Name, phone, blood group, province, district, local level, and ward name are required.",
      );
    }

    if (!isNepalProvince(province)) {
      return jsonError(
        "Select a valid province using its official name.",
      );
    }

    if (phone.length < 7 || phone.length > 30) {
      return jsonError("Enter a valid phone number.");
    }

    if (!isBloodGroup(bloodGroup)) {
      return jsonError("Select a valid blood group.");
    }

    if (email && !isValidEmail(email)) {
      return jsonError("Enter a valid email address.");
    }

    if (!consentGiven) {
      return jsonError(
        "Donor consent is required before registration.",
      );
    }

    const wardNumber = parseWardNumber(body.wardNumber);
    if (wardNumber === null) {
      return jsonError(
        "Enter a valid ward number between 1 and 32.",
      );
    }

    if (!dateOfBirthBS || !isValidBSDate(dateOfBirthBS)) {
      return jsonError(
        "Enter a valid B.S. date of birth in YYYY-MM-DD format.",
      );
    }

    const parsedGregorianDate = parseGregorianDate(body.dateOfBirth);
    if (parsedGregorianDate === undefined) {
      return jsonError(
        "The Gregorian date of birth is invalid or in the future.",
      );
    }

    // The API assigns donor codes, status and verification.
    // Ignore any client-supplied values for those fields.
    for (let attempt = 0; attempt < 5; attempt++) {
      const donorCode = makeDonorCode();

      try {
        const donor = await prisma.donor.create({
          data: {
            donorCode,
            fullName,
            phone,
            email: email || null,
            dateOfBirth: parsedGregorianDate,
            dateOfBirthBS,
            bloodGroup: bloodGroup as BloodGroup,
            province,
            district,
            localLevel,
            wardName,
            wardNumber,
            address: address || null,
            notes: notes || null,
            consentGiven,
            isVerified: false,
            status: "ACTIVE",
            createdById: user.id,
          },
          select: donorSelect,
        });

        return NextResponse.json(
          {
            success: true,
            message: "Donor registered successfully.",
            data: donor,
          },
          { status: 201 },
        );
      } catch (error) {
        if (isDonorCodeCollision(error) && attempt < 4) {
          continue;
        }

        throw error;
      }
    }

    return jsonError(
      "Unable to generate a unique donor code. Please try again.",
      503,
    );
  } catch (error) {
    const response = permissionError(error);
    if (response) return response;

    console.error("Donors POST error:", error);
    return jsonError(
      "Failed to register donor. Please check the submitted information and try again.",
      500,
    );
  }
}
