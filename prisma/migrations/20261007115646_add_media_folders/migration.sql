/*
  Warnings:

  - You are about to drop the column `folder` on the `Media` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Media_folder_idx";

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "folder",
ADD COLUMN     "folderId" TEXT;

-- CreateTable
CREATE TABLE "MediaFolder" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaFolder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaFolder_slug_key" ON "MediaFolder"("slug");

-- CreateIndex
CREATE INDEX "MediaFolder_parentId_idx" ON "MediaFolder"("parentId");

-- CreateIndex
CREATE INDEX "Media_folderId_idx" ON "Media"("folderId");

-- AddForeignKey
ALTER TABLE "MediaFolder" ADD CONSTRAINT "MediaFolder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "MediaFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "MediaFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
