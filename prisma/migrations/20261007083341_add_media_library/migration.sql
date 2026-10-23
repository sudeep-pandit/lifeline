/*
  Warnings:

  - You are about to drop the `ContentItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContentItem" DROP CONSTRAINT "ContentItem_createdById_fkey";

-- DropForeignKey
ALTER TABLE "ContentItem" DROP CONSTRAINT "ContentItem_updatedById_fkey";

-- DropTable
DROP TABLE "ContentItem";

-- DropEnum
DROP TYPE "ContentStatus";

-- DropEnum
DROP TYPE "ContentType";

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "alt" TEXT,
    "folder" TEXT NOT NULL DEFAULT 'general',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Media_mimeType_idx" ON "Media"("mimeType");

-- CreateIndex
CREATE INDEX "Media_folder_idx" ON "Media"("folder");

-- CreateIndex
CREATE INDEX "Media_createdAt_idx" ON "Media"("createdAt");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
