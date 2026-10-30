
import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "reports");
const MAX_FILE_SIZE = 25 * 1024 * 1024;

const CATEGORIES = ["ANNUAL", "FINANCIAL", "PROGRAM", "PROJECT"] as const;
const STATUSES = ["DRAFT", "PUBLISHED"] as const;

function errorResponse(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (error instanceof Error && error.message === "FORBIDDEN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  console.error("Reports API error:", error);
  return NextResponse.json({ error: "Unable to process reports request." }, { status: 500 });
}

function makeSlug(value: string) {
  return value.toLowerCase().trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "report";
}

async function savePdf(file: File) {
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
  };
}

export async function GET(request: NextRequest) {
  try {
    await requirePermission("content.view");

    const params = request.nextUrl.searchParams;
    const search = params.get("search")?.trim();
    const category = params.get("category");
    const status = params.get("status");

    const reports = await prisma.report.findMany({
      where: {
        ...(search ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { reportYear: { contains: search, mode: "insensitive" } },
          ],
        } : {}),
        ...(CATEGORIES.includes(category as (typeof CATEGORIES)[number])
          ? { category: category as (typeof CATEGORIES)[number] }
          : {}),
        ...(STATUSES.includes(status as (typeof STATUSES)[number])
          ? { status: status as (typeof STATUSES)[number] }
          : {}),
      },
      orderBy: [{ updatedAt: "desc" }],
    });

    return NextResponse.json({ reports });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  let uploadedPath: string | null = null;

  try {
    const user = await requirePermission("content.create");
    const form = await request.formData();

    const title = String(form.get("title") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const reportYear = String(form.get("reportYear") ?? "").trim();
    const category = String(form.get("category") ?? "");
    const status = String(form.get("status") ?? "DRAFT");
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
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Upload a PDF file." }, { status: 400 });
    }

    let slug = makeSlug(String(form.get("slug") ?? "") || title);
    const existing = await prisma.report.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${crypto.randomUUID().slice(0, 8)}`;

    const saved = await savePdf(file);
    uploadedPath = path.join(process.cwd(), "public", saved.pdfUrl.replace(/^\//, ""));

    const report = await prisma.report.create({
      data: {
        title,
        slug,
        description: description || null,
        category: category as (typeof CATEGORIES)[number],
        status: status as (typeof STATUSES)[number],
        reportYear: reportYear || null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        isFeatured: form.get("isFeatured") === "true",
        sortOrder: Number(form.get("sortOrder") ?? 0) || 0,
        ...saved,
        mimeType: "application/pdf",
        createdById: user.id,
        updatedById: user.id,
      },
    });

    return NextResponse.json({ report, message: "Report created successfully." }, { status: 201 });
  } catch (error) {
    if (uploadedPath) await fs.unlink(uploadedPath).catch(() => undefined);
    if (error instanceof Error && error.message === "INVALID_PDF") {
      return NextResponse.json({ error: "Please upload a valid PDF file." }, { status: 400 });
    }
    if (error instanceof Error && error.message === "INVALID_SIZE") {
      return NextResponse.json({ error: "PDF must be between 8 bytes and 25 MB." }, { status: 400 });
    }
    return errorResponse(error);
  }
}
