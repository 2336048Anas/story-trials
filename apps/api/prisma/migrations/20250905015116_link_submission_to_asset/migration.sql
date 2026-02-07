/*
  Warnings:

  - You are about to drop the column `amountUsd` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `amountUsd` on the `Payout` table. All the data in the column will be lost.
  - You are about to drop the column `amountUsd` on the `RoyaltyEvent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[walletAddress]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `metadataCid` to the `DataAsset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DataAsset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `License` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Payout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payout` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `RoyaltyEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerId` to the `Trial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Trial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('USD', 'EUR', 'GBP');

-- DropIndex
DROP INDEX "public"."RoyaltyEvent_recipientId_idx";

-- AlterTable
ALTER TABLE "public"."DataAsset" ADD COLUMN     "ipAssetId" TEXT,
ADD COLUMN     "metadataCid" TEXT NOT NULL,
ADD COLUMN     "storyChainId" INTEGER,
ADD COLUMN     "storyTxHash" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."License" ADD COLUMN     "chainLicenseId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "amountUsd",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "currency" "public"."Currency" NOT NULL DEFAULT 'USD';

-- AlterTable
ALTER TABLE "public"."Payout" DROP COLUMN "amountUsd",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "currency" "public"."Currency" NOT NULL DEFAULT 'USD',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."RoyaltyEvent" DROP COLUMN "amountUsd",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "currency" "public"."Currency" NOT NULL DEFAULT 'USD',
ADD COLUMN     "payoutId" TEXT;

-- AlterTable
ALTER TABLE "public"."Submission" ADD COLUMN     "assetId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Trial" ADD COLUMN     "buyerId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "walletAddress" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "DataAsset_ipAssetId_idx" ON "public"."DataAsset"("ipAssetId");

-- CreateIndex
CREATE INDEX "License_chainLicenseId_idx" ON "public"."License"("chainLicenseId");

-- CreateIndex
CREATE INDEX "RoyaltyEvent_recipientId_createdAt_idx" ON "public"."RoyaltyEvent"("recipientId", "createdAt");

-- CreateIndex
CREATE INDEX "RoyaltyEvent_payoutId_idx" ON "public"."RoyaltyEvent"("payoutId");

-- CreateIndex
CREATE INDEX "Submission_assetId_idx" ON "public"."Submission"("assetId");

-- CreateIndex
CREATE INDEX "Trial_buyerId_idx" ON "public"."Trial"("buyerId");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "public"."User"("walletAddress");

-- CreateIndex
CREATE INDEX "User_walletAddress_idx" ON "public"."User"("walletAddress");

-- AddForeignKey
ALTER TABLE "public"."Trial" ADD CONSTRAINT "Trial_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Submission" ADD CONSTRAINT "Submission_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."DataAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RoyaltyEvent" ADD CONSTRAINT "RoyaltyEvent_payoutId_fkey" FOREIGN KEY ("payoutId") REFERENCES "public"."Payout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
