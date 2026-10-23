-- CreateEnum
CREATE TYPE "FinanceTransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "FinanceTransactionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FinancePaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'ESEWA', 'KHALTI', 'CONNECT_IPS', 'CHEQUE', 'OTHER');

-- CreateEnum
CREATE TYPE "FinancePartyType" AS ENUM ('DONOR', 'FUNDER', 'VENDOR', 'BENEFICIARY', 'OTHER');

-- CreateEnum
CREATE TYPE "FinanceAuditAction" AS ENUM ('CREATED', 'UPDATED', 'SUBMITTED', 'APPROVED', 'REJECTED', 'MARKED_PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "FinanceCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FinanceTransactionType" NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceParty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FinancePartyType" NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "panNumber" TEXT,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceTransaction" (
    "id" TEXT NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "type" "FinanceTransactionType" NOT NULL,
    "status" "FinanceTransactionStatus" NOT NULL DEFAULT 'DRAFT',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NPR',
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "paymentMethod" "FinancePaymentMethod" NOT NULL DEFAULT 'CASH',
    "paymentReference" TEXT,
    "attachmentUrl" TEXT,
    "categoryId" TEXT NOT NULL,
    "partyId" TEXT,
    "createdById" TEXT NOT NULL,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "approvalNote" TEXT,
    "paidAt" TIMESTAMP(3),
    "paidById" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinanceAuditLog" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "actorId" TEXT,
    "action" "FinanceAuditAction" NOT NULL,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FinanceAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FinanceCategory_type_isActive_idx" ON "FinanceCategory"("type", "isActive");

-- CreateIndex
CREATE INDEX "FinanceCategory_sortOrder_idx" ON "FinanceCategory"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "FinanceCategory_name_type_key" ON "FinanceCategory"("name", "type");

-- CreateIndex
CREATE INDEX "FinanceParty_name_idx" ON "FinanceParty"("name");

-- CreateIndex
CREATE INDEX "FinanceParty_type_isActive_idx" ON "FinanceParty"("type", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "FinanceTransaction_referenceNumber_key" ON "FinanceTransaction"("referenceNumber");

-- CreateIndex
CREATE INDEX "FinanceTransaction_type_status_transactionDate_idx" ON "FinanceTransaction"("type", "status", "transactionDate");

-- CreateIndex
CREATE INDEX "FinanceTransaction_categoryId_transactionDate_idx" ON "FinanceTransaction"("categoryId", "transactionDate");

-- CreateIndex
CREATE INDEX "FinanceTransaction_partyId_idx" ON "FinanceTransaction"("partyId");

-- CreateIndex
CREATE INDEX "FinanceTransaction_createdById_createdAt_idx" ON "FinanceTransaction"("createdById", "createdAt");

-- CreateIndex
CREATE INDEX "FinanceTransaction_approvedById_idx" ON "FinanceTransaction"("approvedById");

-- CreateIndex
CREATE INDEX "FinanceTransaction_paidAt_idx" ON "FinanceTransaction"("paidAt");

-- CreateIndex
CREATE INDEX "FinanceAuditLog_transactionId_createdAt_idx" ON "FinanceAuditLog"("transactionId", "createdAt");

-- CreateIndex
CREATE INDEX "FinanceAuditLog_actorId_createdAt_idx" ON "FinanceAuditLog"("actorId", "createdAt");

-- AddForeignKey
ALTER TABLE "FinanceTransaction" ADD CONSTRAINT "FinanceTransaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "FinanceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceTransaction" ADD CONSTRAINT "FinanceTransaction_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "FinanceParty"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceTransaction" ADD CONSTRAINT "FinanceTransaction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceTransaction" ADD CONSTRAINT "FinanceTransaction_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceTransaction" ADD CONSTRAINT "FinanceTransaction_paidById_fkey" FOREIGN KEY ("paidById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceAuditLog" ADD CONSTRAINT "FinanceAuditLog_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "FinanceTransaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinanceAuditLog" ADD CONSTRAINT "FinanceAuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
