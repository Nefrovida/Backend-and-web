/*
  Warnings:

  - You are about to drop the column `public` on the `forums` table. All the data in the column will be lost.
  - Added the required column `public_status` to the `forums` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "forums" DROP COLUMN "public",
ADD COLUMN     "public_status" BOOLEAN NOT NULL;
