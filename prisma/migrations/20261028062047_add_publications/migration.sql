-- CreateEnum
CREATE TYPE "PublicationCategory" AS ENUM ('GUIDE_MANUAL', 'AWARENESS_MATERIAL', 'RESEARCH_LEARNING', 'PUBLICATION');

-- DropIndex
DROP INDEX "FinanceAuditLog_actorId_createdAt_idx";

-- CreateTable
CREATE TABLE "Publication" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" "PublicationCategory" NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publicationYear" TEXT,
    "language" TEXT DEFAULT 'English',
    "publisher" TEXT,
    "author" TEXT,
    "edition" TEXT,
    "isbn" TEXT,
    "pdfUrl" TEXT NOT NULL,
    "pdfName" TEXT NOT NULL,
    "pdfSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL DEFAULT 'application/pdf',
    "coverImageUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Publication_slug_key" ON "Publication"("slug");

-- CreateIndex
CREATE INDEX "Publication_category_status_idx" ON "Publication"("category", "status");

-- CreateIndex
CREATE INDEX "Publication_publicationYear_idx" ON "Publication"("publicationYear");

-- CreateIndex
CREATE INDEX "Publication_publishedAt_idx" ON "Publication"("publishedAt");

-- CreateIndex
CREATE INDEX "Publication_isFeatured_idx" ON "Publication"("isFeatured");

-- CreateIndex
CREATE INDEX "Publication_sortOrder_idx" ON "Publication"("sortOrder");

-- CreateIndex
CREATE INDEX "Publication_createdById_idx" ON "Publication"("createdById");

-- CreateIndex
CREATE INDEX "Publication_updatedById_idx" ON "Publication"("updatedById");

-- CreateIndex
CREATE INDEX "FinanceAuditLog_actorId_idx" ON "FinanceAuditLog"("actorId");

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
