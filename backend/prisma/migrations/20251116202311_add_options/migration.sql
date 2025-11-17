-- DropIndex
DROP INDEX "notes_patient_appointment_id_key";

-- DropIndex
DROP INDEX "patient_appointment_appointment_id_key";

-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "ailments" TEXT,
ADD COLUMN     "general_notes" TEXT,
ADD COLUMN     "patient_id" UUID,
ADD COLUMN     "prescription" TEXT;

-- CreateTable
CREATE TABLE "options" (
    "option_id" SERIAL NOT NULL,
    "question_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "options_pkey" PRIMARY KEY ("option_id")
);

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "options" ADD CONSTRAINT "options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions_history"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;
