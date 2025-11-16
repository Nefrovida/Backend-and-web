/*
  Warnings:

  - Made the column `maternal_last_name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "maternal_last_name" SET NOT NULL;
