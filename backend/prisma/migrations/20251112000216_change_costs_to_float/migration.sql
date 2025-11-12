/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `analysis` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `image_url` to the `analysis` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `general_cost` on the `analysis` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `community_cost` on the `analysis` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `general_cost` on the `appointments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `community_cost` on the `appointments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "analysis" ADD COLUMN     "image_url" TEXT NOT NULL,
DROP COLUMN "general_cost",
ADD COLUMN     "general_cost" DOUBLE PRECISION NOT NULL,
DROP COLUMN "community_cost",
ADD COLUMN     "community_cost" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "general_cost",
ADD COLUMN     "general_cost" DOUBLE PRECISION NOT NULL,
DROP COLUMN "community_cost",
ADD COLUMN     "community_cost" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "user_reports" (
    "report_id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "reported_message" INTEGER NOT NULL,
    "cause" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "user_reports_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "report_id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "answer" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "seen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("report_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "analysis_name_key" ON "analysis"("name");

-- AddForeignKey
ALTER TABLE "user_reports" ADD CONSTRAINT "user_reports_reported_message_fkey" FOREIGN KEY ("reported_message") REFERENCES "messages"("message_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_reports" ADD CONSTRAINT "user_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
