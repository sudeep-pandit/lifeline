-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "department" TEXT,
    "bio" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "imageId" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "twitter" TEXT,
    "website" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_slug_key" ON "TeamMember"("slug");

-- CreateIndex
CREATE INDEX "TeamMember_isActive_idx" ON "TeamMember"("isActive");

-- CreateIndex
CREATE INDEX "TeamMember_sortOrder_idx" ON "TeamMember"("sortOrder");

-- CreateIndex
CREATE INDEX "TeamMember_department_idx" ON "TeamMember"("department");

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
