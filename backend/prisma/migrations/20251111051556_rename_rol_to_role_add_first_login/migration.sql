/*
  Warnings:

  - You are about to drop the column `speciality` on the `doctors` table. All the data in the column will be lost.
  - The primary key for the `laboratorists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `laboratorists_id` on the `laboratorists` table. All the data in the column will be lost.
  - You are about to drop the column `timestamp_publish` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `route` on the `results` table. All the data in the column will be lost.
  - You are about to drop the column `rol_name` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `rol_forum` on the `users_forums` table. All the data in the column will be lost.
  - Added the required column `image_url` to the `appointments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialty` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - The required column `laboratorist_id` was added to the `laboratorists` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `duration` to the `patient_analysis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_name` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_login` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forum_role` to the `users_forums` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "patient_analysis" DROP CONSTRAINT "patient_analysis_laboratorist_id_fkey";

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "image_url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "speciality",
ADD COLUMN     "specialty" CHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "forums" ADD COLUMN     "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "laboratorists" DROP CONSTRAINT "laboratorists_pkey",
DROP COLUMN "laboratorists_id",
ADD COLUMN     "laboratorist_id" UUID NOT NULL,
ADD CONSTRAINT "laboratorists_pkey" PRIMARY KEY ("laboratorist_id");

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "timestamp_publish",
ADD COLUMN     "publication_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "patient_analysis" ADD COLUMN     "duration" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "results" DROP COLUMN "route",
ADD COLUMN     "interpretation" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "path" CHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "rol_name",
ADD COLUMN     "role_name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "first_login" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "users_forums" DROP COLUMN "rol_forum",
ADD COLUMN     "forum_role" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "patient_analysis" ADD CONSTRAINT "patient_analysis_laboratorist_id_fkey" FOREIGN KEY ("laboratorist_id") REFERENCES "laboratorists"("laboratorist_id") ON DELETE CASCADE ON UPDATE CASCADE;
