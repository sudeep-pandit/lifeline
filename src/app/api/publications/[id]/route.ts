
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

type RouteContext = {
  params: Promise<{ id: string }>;
};

function errorResponse(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

function handleError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return errorResponse("Please sign in to continue.", 401);
    }

    if (error.message === "FORBIDDEN") {
      return errorResponse("You do not have permission to perform this action.", 403);
    }
  }

  console.error("Publication detail API error:", error);
  return errorResponse("An unexpected error occurred.", 500);
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

function isValidUrl(value: string) {
  if (!value) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function getLocalPdfPath(url: string) {
  const prefix = "/uploads/publications/";

  if (!url.startsWith(prefix)) return null;

  const filename = url.slice(prefix.length);

  // Never allow a stored URL to traverse outside the upload directory.
  if (!filename || path.basename(filename) !== filename) return null;

  return path.join(UPLOAD_DIR, filename);
}

async function validatePdf(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Please select a PDF file.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("The PDF must be 25 MB or smaller.");
  }

  if (
    file.type !== "application/pdf" ||
    !file.name.toLowerCase().endsWith(".pdf")
  ) {
    throw new Error("Only PDF files are allowed.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
    throw new Error("The selected file is not a valid PDF document.");
  }

  return bytes;
}

// PATCH /api/publications/:id
export async function PATCH(
  request: NextRequest,
  { params }: RouteContext,
) {
  let newFilePath: string | null = null;

  try {
    const user = await requirePermission("content.edit");
    const { id } = await params;
    const existing = await prisma.publication.findUnique({ where: { id } });

    if (!existing) {
      return errorResponse("Publication not found.", 404);
    }

    const formData = await request.formData();

    const titleValue = formData.get("title");
    const descriptionValue = formData.get("description");
    const categoryValue = formData.get("category");
    const statusValue = formData.get("status");
    const yearValue = formData.get("publicationYear");
    const languageValue = formData.get("language");
    const authorValue = formData.get("author");
    const publisherValue = formData.get("publisher");
    const editionValue = formData.get("edition");
    const isbnValue = formData.get("isbn");
    const coverValue = formData.get("coverImageUrl");
    const featuredValue = formData.get("isFeatured");
    const orderValue = formData.get("sortOrder");
    const fileValue = formData.get("file");

    const title =
      titleValue === null ? existing.title : String(titleValue).trim();

    const description =
      descriptionValue === null
        ? existing.description
        : String(descriptionValue).trim() || null;

    const category =
      categoryValue === null ? existing.category : String(categoryValue);

    const status =
      statusValue === null ? existing.status : String(statusValue);

    const publicationYear =
      yearValue === null
        ? existing.publicationYear
        : String(yearValue).trim() || null;

    const language =
      languageValue === null
        ? existing.language
        : String(languageValue).trim() || "English";

    const author =
      authorValue === null
        ? existing.author
        : String(authorValue).trim() || null;

    const publisher =
      publisherValue === null
        ? existing.publisher
        : String(publisherValue).trim() || null;

    const edition =
      editionValue === null
        ? existing.edition
        : String(editionValue).trim() || null;

    const isbn =
      isbnValue === null
        ? existing.isbn
        : String(isbnValue).trim() || null;

    const coverImageUrl =
      coverValue === null
        ? existing.coverImageUrl
        : String(coverValue).trim() || null;

    const isFeatured =
      featuredValue === null
        ? existing.isFeatured
        : String(featuredValue) === "true";

    const sortOrder =
      orderValue === null
        ? existing.sortOrder
        : Number(orderValue);

    if (!title || title.length > 200) {
      return errorResponse("Enter a title between 1 and 200 characters.", 400);
    }

    if (!isCategory(category)) {
      return errorResponse("Select a valid publication category.", 400);
    }

    if (!isStatus(status)) {
      return errorResponse("Select a valid publication status.", 400);
    }

    if (description && description.length > 10000) {
      return errorResponse("The description is too long.", 400);
    }

    if (publicationYear && !isValidYear(publicationYear)) {
      return errorResponse("Enter a valid publication year.", 400);
    }

    if (!isValidUrl(coverImageUrl ?? "")) {
      return errorResponse("Cover image must be a valid HTTP or HTTPS URL.", 400);
    }

    if (
      !Number.isInteger(sortOrder) ||
      sortOrder < 0 ||
      sortOrder > 100000
    ) {
      return errorResponse("Sort order must be a non-negative whole number.", 400);
    }

    let pdfData:
      | { bytes: Buffer; file: File; filename: string }
      | undefined;

    if (fileValue instanceof File && fileValue.size > 0) {
      try {
        const bytes = await validatePdf(fileValue);
        pdfData = {
          bytes,
          file: fileValue,
          filename: `${randomUUID()}.pdf`,
        };
      } catch (error) {
        return errorResponse(
          error instanceof Error ? error.message : "Invalid PDF file.",
          400,
        );
      }
    }

    if (pdfData) {
      await mkdir(UPLOAD_DIR, { recursive: true });
      newFilePath = path.join(UPLOAD_DIR, pdfData.filename);
      await writeFile(newFilePath, pdfData.bytes);
    }

    const publishedAt =
      status === "DRAFT"
        ? null
        : existing.status === "PUBLISHED" && existing.publishedAt
          ? existing.publishedAt
          : new Date();

    const updated = await prisma.publication.update({
      where: { id },
      data: {
        title,
        description,
        category,
        status,
        publicationYear,
        language,
        author,
        publisher,
        edition,
        isbn,
        coverImageUrl,
        isFeatured,
        sortOrder,
        publishedAt,
        updatedById: user.id,
        ...(pdfData
          ? {
              pdfUrl: `/uploads/publications/${pdfData.filename}`,
              pdfName: pdfData.file.name.slice(0, 255),
              pdfSize: pdfData.file.size,
              mimeType: "application/pdf",
            }
          : {}),
      },
    });

    // Delete the old local file only after the database update succeeds.
    if (pdfData) {
      const oldPath = getLocalPdfPath(existing.pdfUrl);

      if (oldPath && oldPath !== newFilePath) {
        await unlink(oldPath).catch((error: NodeJS.ErrnoException) => {
          if (error.code !== "ENOENT") {
            console.error("Unable to remove replaced publication PDF:", error);
          }
        });
      }
    }

    return NextResponse.json({
      message: "Publication updated successfully.",
      publication: updated,
    });
  } catch (error) {
    if (newFilePath) {
      await unlink(newFilePath).catch(() => undefined);
    }

    return handleError(error);
  }
}

// DELETE /api/publications/:id
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext,
) {
  try {
    await requirePermission("content.delete");
    const { id } = await params;

    const existing = await prisma.publication.findUnique({ where: { id } });

    if (!existing) {
      return errorResponse("Publication not found.", 404);
    }

    await prisma.publication.delete({ where: { id } });

    const filePath = getLocalPdfPath(existing.pdfUrl);

    if (filePath) {
      await unlink(filePath).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== "ENOENT") {
          console.error("Unable to remove deleted publication PDF:", error);
        }
      });
    }

    return NextResponse.json({
      message: "Publication deleted successfully.",
    });
  } catch (error) {
    return handleError(error);
  }
}
