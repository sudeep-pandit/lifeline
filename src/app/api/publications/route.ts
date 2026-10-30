
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";

import { NextRequest, NextResponse } from "next/server";
import {
  ContentStatus,
  PublicationCategory,
} from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "publications",
);

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const CATEGORIES = [
  "GUIDE_MANUAL",
  "AWARENESS_MATERIAL",
  "RESEARCH_LEARNING",
  "PUBLICATION",
] as const;

const STATUSES = ["DRAFT", "PUBLISHED"] as const;

function jsonError(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

function handleApiError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return jsonError("Please sign in to continue.", 401);
    }

    if (error.message === "FORBIDDEN") {
      return jsonError("You do not have permission to perform this action.", 403);
    }
  }

  console.error("Publications API error:", error);

  return jsonError("An unexpected error occurred.", 500);
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function isCategory(value: string): value is PublicationCategory {
  return CATEGORIES.includes(value as (typeof CATEGORIES)[number]);
}

function isStatus(value: string): value is ContentStatus {
  return STATUSES.includes(value as (typeof STATUSES)[number]);
}

function isValidYear(value: string) {
  return value.length <= 20 && /^[0-9/ -]*$/.test(value);
}

function isValidOptionalUrl(value: string) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

// GET /api/publications
export async function GET(request: NextRequest) {
  try {
    await requirePermission("content.view");

    const params = request.nextUrl.searchParams;
    const search = params.get("search")?.trim() ?? "";
    const category = params.get("category") ?? "";
    const status = params.get("status") ?? "";

    if (category && !isCategory(category)) {
      return jsonError("Invalid publication category.", 400);
    }

    if (status && !isStatus(status)) {
      return jsonError("Invalid publication status.", 400);
    }

    const publications = await prisma.publication.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(status ? { status } : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                {
                  description: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  author: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  publisher: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: [
        { sortOrder: "asc" },
        { updatedAt: "desc" },
      ],
    });

    return NextResponse.json({ publications });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/publications
export async function POST(request: NextRequest) {
  let savedFilePath: string | null = null;

  try {
    const user = await requirePermission("content.create");
    const formData = await request.formData();

    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const categoryValue = String(formData.get("category") ?? "");
    const statusValue = String(formData.get("status") ?? "DRAFT");
    const publicationYear = String(
      formData.get("publicationYear") ?? "",
    ).trim();
    const language = String(formData.get("language") ?? "English").trim();
    const author = String(formData.get("author") ?? "").trim();
    const publisher = String(formData.get("publisher") ?? "").trim();
    const edition = String(formData.get("edition") ?? "").trim();
    const isbn = String(formData.get("isbn") ?? "").trim();
    const coverImageUrl = String(
      formData.get("coverImageUrl") ?? "",
    ).trim();
    const isFeatured = String(formData.get("isFeatured") ?? "false") === "true";
    const sortOrder = Number(formData.get("sortOrder") ?? 0);
    const file = formData.get("file");

    if (!title || title.length > 200) {
      return jsonError("Enter a title between 1 and 200 characters.", 400);
    }

    if (!isCategory(categoryValue)) {
      return jsonError("Select a valid publication category.", 400);
    }

    if (!isStatus(statusValue)) {
      return jsonError("Select a valid publication status.", 400);
    }

    if (description.length > 10000) {
      return jsonError("The description is too long.", 400);
    }

    if (publicationYear && !isValidYear(publicationYear)) {
      return jsonError("Enter a valid publication year.", 400);
    }

    if (!isValidOptionalUrl(coverImageUrl)) {
      return jsonError("Cover image must be a valid HTTP or HTTPS URL.", 400);
    }

    if (
      !Number.isInteger(sortOrder) ||
      sortOrder < 0 ||
      sortOrder > 100000
    ) {
      return jsonError("Sort order must be a non-negative whole number.", 400);
    }

    if (!(file instanceof File) || file.size === 0) {
      return jsonError("Please select a PDF file.", 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      return jsonError("The PDF must be 25 MB or smaller.", 400);
    }

    if (
      file.type !== "application/pdf" ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return jsonError("Only PDF files are allowed.", 400);
    }

    const bytes = Buffer.from(await file.arrayBuffer());

    // Verify the actual file header instead of trusting its extension alone.
    if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
      return jsonError("The selected file is not a valid PDF document.", 400);
    }

    const fileName = `${randomUUID()}.pdf`;
    await mkdir(UPLOAD_DIR, { recursive: true });

    savedFilePath = path.join(UPLOAD_DIR, fileName);
    await writeFile(savedFilePath, bytes);

    const baseSlug = slugify(title) || "publication";
    const slug = `${baseSlug}-${randomUUID().slice(0, 8)}`;
    const now = new Date();

    const publication = await prisma.publication.create({
      data: {
        title,
        slug,
        description: description || null,
        category: categoryValue,
        status: statusValue,
        publicationYear: publicationYear || null,
        language: language || "English",
        author: author || null,
        publisher: publisher || null,
        edition: edition || null,
        isbn: isbn || null,
        coverImageUrl: coverImageUrl || null,
        pdfUrl: `/uploads/publications/${fileName}`,
        pdfName: file.name.slice(0, 255),
        pdfSize: file.size,
        mimeType: "application/pdf",
        isFeatured,
        sortOrder,
        publishedAt: statusValue === "PUBLISHED" ? now : null,
        createdById: user.id,
        updatedById: user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Publication created successfully.",
        publication,
      },
      { status: 201 },
    );
  } catch (error) {
    if (savedFilePath) {
      await unlink(savedFilePath).catch(() => undefined);
    }

    return handleApiError(error);
  }
}