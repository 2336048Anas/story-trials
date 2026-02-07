-- CreateEnum
CREATE TYPE "public"."SubmissionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."Submission" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "trialId" TEXT NOT NULL,
    "dataCid" TEXT NOT NULL,
    "status" "public"."SubmissionStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Submission_userId_idx" ON "public"."Submission"("userId");

-- CreateIndex
CREATE INDEX "Submission_trialId_idx" ON "public"."Submission"("trialId");
