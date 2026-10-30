-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- CreateEnum
CREATE TYPE "DonorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "DonorApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "BloodRequestStatus" AS ENUM ('PENDING', 'VERIFIED', 'IN_PROGRESS', 'FULFILLED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "BloodRequestUrgency" AS ENUM ('NORMAL', 'URGENT', 'EMERGENCY');

-- CreateTable
CREATE TABLE "DonorApplication" (
    "id" TEXT NOT NULL,
    "applicationNumber" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "bloodGroup" "BloodGroup" NOT NULL,
    "district" TEXT NOT NULL,
    "province" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "status" "DonorApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewNote" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "donorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DonorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donor" (
    "id" TEXT NOT NULL,
    "donorCode" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "bloodGroup" "BloodGroup" NOT NULL,
    "district" TEXT NOT NULL,
    "province" TEXT,
    "address" TEXT,
    "status" "DonorStatus" NOT NULL DEFAULT 'ACTIVE',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "lastDonationAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloodRequest" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "requesterName" TEXT NOT NULL,
    "requesterPhone" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "unitsNeeded" INTEGER NOT NULL DEFAULT 1,
    "hospitalName" TEXT,
    "district" TEXT NOT NULL,
    "province" TEXT,
    "locationDetails" TEXT,
    "urgency" "BloodRequestUrgency" NOT NULL DEFAULT 'NORMAL',
    "status" "BloodRequestStatus" NOT NULL DEFAULT 'PENDING',
    "neededBy" TIMESTAMP(3),
    "notes" TEXT,
    "consentToContact" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BloodRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DonationRecord" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "bloodRequestId" TEXT,
    "donationDate" TIMESTAMP(3) NOT NULL,
    "donationCenter" TEXT,
    "unitsDonated" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "recordedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DonationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DonorApplication_applicationNumber_key" ON "DonorApplication"("applicationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "DonorApplication_donorId_key" ON "DonorApplication"("donorId");

-- CreateIndex
CREATE INDEX "DonorApplication_status_createdAt_idx" ON "DonorApplication"("status", "createdAt");

-- CreateIndex
CREATE INDEX "DonorApplication_bloodGroup_district_idx" ON "DonorApplication"("bloodGroup", "district");

-- CreateIndex
CREATE INDEX "DonorApplication_phone_idx" ON "DonorApplication"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_donorCode_key" ON "Donor"("donorCode");

-- CreateIndex
CREATE INDEX "Donor_bloodGroup_district_status_idx" ON "Donor"("bloodGroup", "district", "status");

-- CreateIndex
CREATE INDEX "Donor_fullName_idx" ON "Donor"("fullName");

-- CreateIndex
CREATE INDEX "Donor_phone_idx" ON "Donor"("phone");

-- CreateIndex
CREATE INDEX "Donor_isVerified_status_idx" ON "Donor"("isVerified", "status");

-- CreateIndex
CREATE UNIQUE INDEX "BloodRequest_requestNumber_key" ON "BloodRequest"("requestNumber");

-- CreateIndex
CREATE INDEX "BloodRequest_status_urgency_createdAt_idx" ON "BloodRequest"("status", "urgency", "createdAt");

-- CreateIndex
CREATE INDEX "BloodRequest_bloodGroup_district_idx" ON "BloodRequest"("bloodGroup", "district");

-- CreateIndex
CREATE INDEX "BloodRequest_neededBy_idx" ON "BloodRequest"("neededBy");

-- CreateIndex
CREATE INDEX "DonationRecord_donorId_donationDate_idx" ON "DonationRecord"("donorId", "donationDate");

-- CreateIndex
CREATE INDEX "DonationRecord_bloodRequestId_idx" ON "DonationRecord"("bloodRequestId");

-- CreateIndex
CREATE INDEX "DonationRecord_recordedById_idx" ON "DonationRecord"("recordedById");

-- AddForeignKey
ALTER TABLE "DonorApplication" ADD CONSTRAINT "DonorApplication_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonorApplication" ADD CONSTRAINT "DonorApplication_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donor" ADD CONSTRAINT "Donor_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloodRequest" ADD CONSTRAINT "BloodRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationRecord" ADD CONSTRAINT "DonationRecord_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationRecord" ADD CONSTRAINT "DonationRecord_bloodRequestId_fkey" FOREIGN KEY ("bloodRequestId") REFERENCES "BloodRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DonationRecord" ADD CONSTRAINT "DonationRecord_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
