-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'REQUESTED';

-- DropIndex
DROP INDEX "notes_patient_appointment_id_key";

-- DropIndex
DROP INDEX "patient_appointment_appointment_id_key";

-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "ailments" TEXT,
ADD COLUMN     "general_notes" TEXT,
ADD COLUMN     "patient_id" UUID,
ADD COLUMN     "prescription" TEXT;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE ON UPDATE CASCADE;
