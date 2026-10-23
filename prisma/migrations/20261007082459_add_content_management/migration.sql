-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('PAGE', 'SECTION');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "ContentItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "key" TEXT NOT NULL,
    "type" "ContentType" NOT NULL DEFAULT 'PAGE',
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "excerpt" TEXT,
    "content" TEXT,
    "imageUrl" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT,
    "isHomepage" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentItem_slug_key" ON "ContentItem"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ContentItem_key_key" ON "ContentItem"("key");

-- CreateIndex
CREATE INDEX "ContentItem_type_idx" ON "ContentItem"("type");

-- CreateIndex
CREATE INDEX "ContentItem_status_idx" ON "ContentItem"("status");

-- CreateIndex
CREATE INDEX "ContentItem_isHomepage_idx" ON "ContentItem"("isHomepage");

-- CreateIndex
CREATE INDEX "ContentItem_sortOrder_idx" ON "ContentItem"("sortOrder");

-- CreateIndex
CREATE INDEX "ContentItem_createdAt_idx" ON "ContentItem"("createdAt");

-- AddForeignKey
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
