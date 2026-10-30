
import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "reports");
const CATEGORIES = ["ANNUAL", "FINANCIAL", "PROGRAM", "PROJECT"] as const;
const STATUSES = ["DRAFT", "PUBLISHED"] as const;
const MAX_FILE_SIZE = 25 * 1024 * 1024;

type Context = { params: Promise<{ id: string }> };

function responseError(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (error instanceof Error && error.message === "FORBIDDEN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  console.error("Report API error:", error);
  return NextResponse.json({ error: "Unable to process report." }, { status: 500 });
}

function makeSlug(value: string) {
  return value.toLowerCase().trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "report";
}

async function storePdf(file: File) {
  if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("INVALID_PDF");
  }
  if (file.size < 8 || file.size > MAX_FILE_SIZE) {
    throw new Error("INVALID_SIZE");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
    throw new Error("INVALID_PDF");
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${crypto.randomUUID()}.pdf`;
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer, { flag: "wx" });

  return {
    pdfUrl: `/uploads/reports/${filename}`,
    pdfName: path.basename(file.name).slice(0, 255),
    pdfSize: buffer.length,
    mimeType: "application/pdf",
  };
}

function localPdfPath(url: string) {
  const prefix = "/uploads/reports/";
  if (!url.startsWith(prefix)) return null;

  const filename = url.slice(prefix.length);
  if (!/^[a-f0-9-]+\.pdf$/i.test(filename)) return null;

  return path.join(UPLOAD_DIR, filename);
}

export async function PATCH(request: NextRequest, context: Context) {
  let newPdfPath: string | null = null;

  try {
    const user = await requirePermission("content.edit");
    const { id } = await context.params;

    const existing = await prisma.report.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    const form = await request.formData();
    const title = String(form.get("title") ?? existing.title).trim();
    const description = String(form.get("description") ?? existing.description ?? "").trim();
    const reportYear = String(form.get("reportYear") ?? existing.reportYear ?? "").trim();
    const category = String(form.get("category") ?? existing.category);
    const status = String(form.get("status") ?? existing.status);
    const slugInput = String(form.get("slug") ?? existing.slug).trim();
    const file = form.get("file");

    if (!title || title.length > 200) {
      return NextResponse.json({ error: "Title is required (maximum 200 characters)." }, { status: 400 });
    }
    if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
      return NextResponse.json({ error: "Choose a valid report category." }, { status: 400 });
    }
    if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
      return NextResponse.json({ error: "Choose a valid publication status." }, { status: 400 });
    }

    const slug = makeSlug(slugInput || title);
    const duplicate = await prisma.report.findFirst({
      where: { slug, NOT: { id } },
      select: { id: true },
    });
    if (duplicate) {
      return NextResponse.json({ error: "That report URL slug is already in use." }, { status: 409 });
    }

    let savedPdf: Awaited<ReturnType<typeof storePdf>> | null = null;
    if (file instanceof File && file.size > 0) {
      savedPdf = await storePdf(file);
      newPdfPath = path.join(process.cwd(), "public", savedPdf.pdfUrl.replace(/^\//, ""));
    }

    const wasPublished = existing.status === "PUBLISHED";
    const isPublished = status === "PUBLISHED";

    const report = await prisma.report.update({
      where: { id },
      data: {
        title,
        slug,
        description: description || null,
        reportYear: reportYear || null,
        category: category as (typeof CATEGORIES)[number],
        status: status as (typeof STATUSES)[number],
        publishedAt: isPublished
          ? (wasPublished ? existing.publishedAt ?? new Date() : new Date())
          : null,
        isFeatured: form.has("isFeatured")
          ? form.get("isFeatured") === "true"
          : existing.isFeatured,
        sortOrder: form.has("sortOrder")
          ? Number(form.get("sortOrder")) || 0
          : existing.sortOrder,
        ...(savedPdf ?? {}),
        updatedById: user.id,
      },
    });

    if (savedPdf) {
      const oldPath = localPdfPath(existing.pdfUrl);
      if (oldPath) await fs.unlink(oldPath).catch(() => undefined);
    }

    return NextResponse.json({ report, message: "Report updated successfully." });
  } catch (error) {
    if (newPdfPath) await fs.unlink(newPdfPath).catch(() => undefined);

    if (error instanceof Error && error.message === "INVALID_PDF") {
      return NextResponse.json({ error: "Please upload a valid PDF file." }, { status: 400 });
    }
    if (error instanceof Error && error.message === "INVALID_SIZE") {
      return NextResponse.json({ error: "PDF must be between 8 bytes and 25 MB." }, { status: 400 });
    }
    return responseError(error);
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  try {
    await requirePermission("content.delete");
    const { id } = await context.params;

    const existing = await prisma.report.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    await prisma.report.delete({ where: { id } });

    const filePath = localPdfPath(existing.pdfUrl);
    if (filePath) await fs.unlink(filePath).catch(() => undefined);

    return NextResponse.json({ message: "Report deleted successfully." });
  } catch (error) {
    return responseError(error);
  }
}
