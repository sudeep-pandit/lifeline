-- AlterTable
ALTER TABLE "Donor" ADD COLUMN     "dateOfBirthBS" TEXT,
ADD COLUMN     "localLevel" TEXT,
ADD COLUMN     "wardName" TEXT,
ADD COLUMN     "wardNumber" INTEGER;

-- AlterTable
ALTER TABLE "DonorApplication" ADD COLUMN     "dateOfBirthBS" TEXT,
ADD COLUMN     "localLevel" TEXT,
ADD COLUMN     "wardName" TEXT,
ADD COLUMN     "wardNumber" INTEGER;

-- CreateIndex
CREATE INDEX "Donor_province_district_localLevel_idx" ON "Donor"("province", "district", "localLevel");

-- CreateIndex
CREATE INDEX "DonorApplication_province_district_localLevel_idx" ON "DonorApplication"("province", "district", "localLevel");
