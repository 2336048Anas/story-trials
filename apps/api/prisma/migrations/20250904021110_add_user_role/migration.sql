-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('CONTRIBUTOR', 'BUYER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."LicenseStatus" AS ENUM ('ISSUED', 'REVOKED');

-- CreateEnum
CREATE TYPE "public"."PayoutStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'CONTRIBUTOR';

-- CreateTable
CREATE TABLE "public"."DataAsset" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "ipfsCid" TEXT NOT NULL,
    "termsRef" TEXT,
    "isListed" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "DataAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."License" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."LicenseStatus" NOT NULL DEFAULT 'ISSUED',
    "assetId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "txHash" TEXT,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "licenseId" TEXT NOT NULL,
    "amountUsd" INTEGER NOT NULL,
    "chainTx" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RoyaltyEvent" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "licenseId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "amountUsd" INTEGER NOT NULL,
    "note" TEXT,

    CONSTRAINT "RoyaltyEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payout" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipientId" TEXT NOT NULL,
    "amountUsd" INTEGER NOT NULL,
    "status" "public"."PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DataAsset_ownerId_idx" ON "public"."DataAsset"("ownerId");

-- CreateIndex
CREATE INDEX "DataAsset_isListed_idx" ON "public"."DataAsset"("isListed");

-- CreateIndex
CREATE INDEX "License_assetId_idx" ON "public"."License"("assetId");

-- CreateIndex
CREATE INDEX "License_buyerId_idx" ON "public"."License"("buyerId");

-- CreateIndex
CREATE INDEX "License_status_idx" ON "public"."License"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_licenseId_key" ON "public"."Payment"("licenseId");

-- CreateIndex
CREATE INDEX "RoyaltyEvent_recipientId_idx" ON "public"."RoyaltyEvent"("recipientId");

-- CreateIndex
CREATE INDEX "RoyaltyEvent_licenseId_idx" ON "public"."RoyaltyEvent"("licenseId");

-- CreateIndex
CREATE INDEX "Payout_recipientId_idx" ON "public"."Payout"("recipientId");

-- CreateIndex
CREATE INDEX "Payout_status_idx" ON "public"."Payout"("status");

-- CreateIndex
CREATE INDEX "Submission_status_idx" ON "public"."Submission"("status");

-- CreateIndex
CREATE INDEX "Trial_isOpen_idx" ON "public"."Trial"("isOpen");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "public"."User"("role");

-- AddForeignKey
ALTER TABLE "public"."DataAsset" ADD CONSTRAINT "DataAsset_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."License" ADD CONSTRAINT "License_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."DataAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."License" ADD CONSTRAINT "License_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "public"."License"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoyaltyEvent" ADD CONSTRAINT "RoyaltyEvent_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "public"."License"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoyaltyEvent" ADD CONSTRAINT "RoyaltyEvent_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payout" ADD CONSTRAINT "Payout_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
