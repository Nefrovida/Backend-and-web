-- CreateEnum
CREATE TYPE "ANALYSIS_STATUS" AS ENUM ('LAB', 'PENDING', 'SENT');

-- AlterTable
ALTER TABLE "patient_analysis" ADD COLUMN     "analysis_status" "ANALYSIS_STATUS" NOT NULL DEFAULT 'LAB';
