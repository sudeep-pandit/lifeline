-- CreateEnum
CREATE TYPE "ReportCategory" AS ENUM ('ANNUAL', 'FINANCIAL', 'PROGRAM', 'PROJECT');

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" "ReportCategory" NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "reportYear" TEXT,
    "publishedAt" TIMESTAMP(3),
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "pdfUrl" TEXT NOT NULL,
    "pdfName" TEXT NOT NULL,
    "pdfSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'application/pdf',
    "coverImageUrl" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_slug_key" ON "Report"("slug");

-- CreateIndex
CREATE INDEX "Report_category_status_idx" ON "Report"("category", "status");

-- CreateIndex
CREATE INDEX "Report_reportYear_idx" ON "Report"("reportYear");

-- CreateIndex
CREATE INDEX "Report_publishedAt_idx" ON "Report"("publishedAt");

-- CreateIndex
CREATE INDEX "Report_isFeatured_idx" ON "Report"("isFeatured");

-- CreateIndex
CREATE INDEX "Report_sortOrder_idx" ON "Report"("sortOrder");

-- CreateIndex
CREATE INDEX "Report_createdById_idx" ON "Report"("createdById");

-- CreateIndex
CREATE INDEX "Report_updatedById_idx" ON "Report"("updatedById");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
