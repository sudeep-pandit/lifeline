import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

import { getSessionUser } from "@/lib/auth";
import { requirePermission } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

const UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "media",
);

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export async function GET(request: NextRequest) {
  try {
    await requirePermission("media.view");

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const type = searchParams.get("type") || "all";
    const folderId = searchParams.get("folderId");

    const where: {
      OR?: Array<{
        originalName?: {
          contains: string;
          mode: "insensitive";
        };
        filename?: {
          contains: string;
          mode: "insensitive";
        };
      }>;
      mimeType?: {
        startsWith: string;
      };
      folderId?: string | null;
    } = {};

    if (search) {
      where.OR = [
        {
          originalName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          filename: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (type === "images") {
      where.mimeType = {
        startsWith: "image/",
      };
    }

    if (type === "other") {
      where.mimeType = {
        startsWith: "application/",
      };
    }

    if (folderId) {
      where.folderId = folderId;
    }

    const [
      media,
      total,
      images,
      folders,
      storageResult,
    ] = await Promise.all([
      prisma.media.findMany({
        where,
        include: {
          folder: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.media.count(),

      prisma.media.count({
        where: {
          mimeType: {
            startsWith: "image/",
          },
        },
      }),

      prisma.mediaFolder.count(),

      prisma.media.aggregate({
        _sum: {
          size: true,
        },
      }),
    ]);

    const storage = storageResult._sum.size ?? 0;

    return NextResponse.json({
      media,
      stats: {
        total,
        images,
        folders,
        storage,
      },
    });
  } catch (error) {
    console.error("GET /api/media error:", error);

    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 },
        );
      }

      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 },
        );
      }
    }

    return NextResponse.json(
      {
        error: "Unable to load media.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requirePermission("media.upload");

    const formData = await request.formData();

    const file = formData.get("file");

    const altValue = formData.get("alt");
    const folderIdValue = formData.get("folderId");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          error: "No file was provided.",
        },
        {
          status: 400,
        },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Please upload JPG, PNG, WEBP, GIF or SVG.",
        },
        {
          status: 400,
        },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "File size cannot exceed 10 MB.",
        },
        {
          status: 400,
        },
      );
    }

    let folderId: string | null = null;

    if (
      typeof folderIdValue === "string" &&
      folderIdValue.trim()
    ) {
      const folder = await prisma.mediaFolder.findUnique({
        where: {
          id: folderIdValue,
        },
      });

      if (!folder) {
        return NextResponse.json(
          {
            error: "Selected folder does not exist.",
          },
          {
            status: 400,
          },
        );
      }

      folderId = folder.id;
    }

    await fs.mkdir(UPLOAD_DIR, {
      recursive: true,
    });

    const extension = getExtension(file.name, file.type);

    const filename = `${crypto.randomUUID()}${extension}`;

    const filePath = path.join(
      UPLOAD_DIR,
      filename,
    );

    const buffer = Buffer.from(
      await file.arrayBuffer(),
    );

    await fs.writeFile(filePath, buffer);

    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: `/uploads/media/${filename}`,
        alt:
          typeof altValue === "string" && altValue.trim()
            ? altValue.trim()
            : null,
        folderId,
        createdById: user.id,
      },
      include: {
        folder: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        media,
        message: "Media uploaded successfully.",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/media error:", error);

    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 },
        );
      }

      if (error.message === "FORBIDDEN") {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 },
        );
      }
    }

    return NextResponse.json(
      {
        error: "Unable to upload media.",
      },
      {
        status: 500,
      },
    );
  }
}

function getExtension(
  filename: string,
  mimeType: string,
) {
  const originalExtension = path.extname(filename);

  if (originalExtension) {
    return originalExtension.toLowerCase();
  }

  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";

    case "image/png":
      return ".png";

    case "image/webp":
      return ".webp";

    case "image/gif":
      return ".gif";

    case "image/svg+xml":
      return ".svg";

    default:
      return "";
  }
}