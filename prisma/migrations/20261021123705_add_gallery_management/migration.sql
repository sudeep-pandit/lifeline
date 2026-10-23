-- CreateTable
CREATE TABLE "GalleryAlbum" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "coverMediaId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryPhoto" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GalleryAlbum_slug_key" ON "GalleryAlbum"("slug");

-- CreateIndex
CREATE INDEX "GalleryAlbum_status_idx" ON "GalleryAlbum"("status");

-- CreateIndex
CREATE INDEX "GalleryAlbum_category_idx" ON "GalleryAlbum"("category");

-- CreateIndex
CREATE INDEX "GalleryAlbum_year_idx" ON "GalleryAlbum"("year");

-- CreateIndex
CREATE INDEX "GalleryAlbum_sortOrder_idx" ON "GalleryAlbum"("sortOrder");

-- CreateIndex
CREATE INDEX "GalleryAlbum_isFeatured_idx" ON "GalleryAlbum"("isFeatured");

-- CreateIndex
CREATE INDEX "GalleryPhoto_albumId_sortOrder_idx" ON "GalleryPhoto"("albumId", "sortOrder");

-- CreateIndex
CREATE INDEX "GalleryPhoto_mediaId_idx" ON "GalleryPhoto"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryPhoto_albumId_mediaId_key" ON "GalleryPhoto"("albumId", "mediaId");

-- AddForeignKey
ALTER TABLE "GalleryAlbum" ADD CONSTRAINT "GalleryAlbum_coverMediaId_fkey" FOREIGN KEY ("coverMediaId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryPhoto" ADD CONSTRAINT "GalleryPhoto_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "GalleryAlbum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryPhoto" ADD CONSTRAINT "GalleryPhoto_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;
