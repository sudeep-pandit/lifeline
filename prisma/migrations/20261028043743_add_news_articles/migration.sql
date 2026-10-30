-- CreateEnum
CREATE TYPE "NewsCategory" AS ENUM ('NEWS', 'NOTICE', 'ANNOUNCEMENT', 'UPDATES');

-- CreateTable
CREATE TABLE "NewsArticle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "NewsCategory" NOT NULL DEFAULT 'NEWS',
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "imageUrl" TEXT,
    "imageAlt" TEXT,
    "location" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdById" TEXT,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsArticle_slug_key" ON "NewsArticle"("slug");

-- CreateIndex
CREATE INDEX "NewsArticle_status_publishedAt_idx" ON "NewsArticle"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "NewsArticle_category_idx" ON "NewsArticle"("category");

-- CreateIndex
CREATE INDEX "NewsArticle_isFeatured_idx" ON "NewsArticle"("isFeatured");

-- CreateIndex
CREATE INDEX "NewsArticle_createdAt_idx" ON "NewsArticle"("createdAt");

-- CreateIndex
CREATE INDEX "NewsArticle_createdById_idx" ON "NewsArticle"("createdById");

-- CreateIndex
CREATE INDEX "NewsArticle_updatedById_idx" ON "NewsArticle"("updatedById");

-- AddForeignKey
ALTER TABLE "NewsArticle" ADD CONSTRAINT "NewsArticle_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsArticle" ADD CONSTRAINT "NewsArticle_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
