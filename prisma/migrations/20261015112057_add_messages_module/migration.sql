-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "enquiryType" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isImportant" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Message_isRead_createdAt_idx" ON "Message"("isRead", "createdAt");

-- CreateIndex
CREATE INDEX "Message_isImportant_idx" ON "Message"("isImportant");

-- CreateIndex
CREATE INDEX "Message_isArchived_createdAt_idx" ON "Message"("isArchived", "createdAt");

-- CreateIndex
CREATE INDEX "Message_email_idx" ON "Message"("email");
