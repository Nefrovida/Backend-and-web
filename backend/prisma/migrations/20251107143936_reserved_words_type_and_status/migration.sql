/*
  Warnings:

  - You are about to drop the column `status` on the `patient_appointment` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `patient_appointment` table. All the data in the column will be lost.
  - Added the required column `appointment_status` to the `patient_appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appointment_type` to the `patient_appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patient_appointment" DROP COLUMN "status",
DROP COLUMN "type",
ADD COLUMN     "appointment_status" "Status" NOT NULL,
ADD COLUMN     "appointment_type" "Type" NOT NULL;
