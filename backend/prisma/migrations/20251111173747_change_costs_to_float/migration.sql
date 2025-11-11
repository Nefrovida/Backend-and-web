/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `analysis` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `general_cost` on the `analysis` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `community_cost` on the `analysis` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `general_cost` on the `appointments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `community_cost` on the `appointments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "analysis" DROP COLUMN "general_cost",
ADD COLUMN     "general_cost" DOUBLE PRECISION NOT NULL,
DROP COLUMN "community_cost",
ADD COLUMN     "community_cost" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "general_cost",
ADD COLUMN     "general_cost" DOUBLE PRECISION NOT NULL,
DROP COLUMN "community_cost",
ADD COLUMN     "community_cost" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "analysis_name_key" ON "analysis"("name");
