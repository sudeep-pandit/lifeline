-- CreateIndex
CREATE INDEX "Donor_email_idx" ON "Donor"("email");

-- CreateIndex
CREATE INDEX "Donor_status_createdAt_idx" ON "Donor"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Donor_createdAt_idx" ON "Donor"("createdAt");
