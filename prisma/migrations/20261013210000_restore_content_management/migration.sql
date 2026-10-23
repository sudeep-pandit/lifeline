DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ContentType') THEN
        CREATE TYPE "ContentType" AS ENUM ('PAGE', 'SECTION');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ContentStatus') THEN
        CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "ContentItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "slug" TEXT,
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

CREATE UNIQUE INDEX IF NOT EXISTS "ContentItem_slug_key"
    ON "ContentItem"("slug");
CREATE UNIQUE INDEX IF NOT EXISTS "ContentItem_key_key"
    ON "ContentItem"("key");
CREATE INDEX IF NOT EXISTS "ContentItem_type_idx"
    ON "ContentItem"("type");
CREATE INDEX IF NOT EXISTS "ContentItem_status_idx"
    ON "ContentItem"("status");
CREATE INDEX IF NOT EXISTS "ContentItem_isHomepage_idx"
    ON "ContentItem"("isHomepage");
CREATE INDEX IF NOT EXISTS "ContentItem_isFeatured_idx"
    ON "ContentItem"("isFeatured");
CREATE INDEX IF NOT EXISTS "ContentItem_sortOrder_idx"
    ON "ContentItem"("sortOrder");
CREATE INDEX IF NOT EXISTS "ContentItem_createdAt_idx"
    ON "ContentItem"("createdAt");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'ContentItem_createdById_fkey'
    ) THEN
        ALTER TABLE "ContentItem"
        ADD CONSTRAINT "ContentItem_createdById_fkey"
        FOREIGN KEY ("createdById") REFERENCES "User"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'ContentItem_updatedById_fkey'
    ) THEN
        ALTER TABLE "ContentItem"
        ADD CONSTRAINT "ContentItem_updatedById_fkey"
        FOREIGN KEY ("updatedById") REFERENCES "User"("id")
        ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
