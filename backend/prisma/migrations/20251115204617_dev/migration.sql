-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('MISSED', 'CANCELED', 'FINISHED', 'PROGRAMMED');

-- CreateEnum
CREATE TYPE "ANALYSIS_STATUS" AS ENUM ('LAB', 'PENDING', 'SENT', 'REQUESTED');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('PRESENCIAL', 'VIRTUAL');

-- CreateEnum
CREATE TYPE "ForumRole" AS ENUM ('OWNER', 'MODERATOR', 'MEMBER', 'VIEWER');

-- CreateTable
CREATE TABLE "roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" TEXT NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "privileges" (
    "privilege_id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "privileges_pkey" PRIMARY KEY ("privilege_id")
);

-- CreateTable
CREATE TABLE "role_privilege" (
    "role_id" INTEGER NOT NULL,
    "privilege_id" INTEGER NOT NULL,

    CONSTRAINT "role_privilege_pkey" PRIMARY KEY ("role_id","privilege_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "parent_last_name" TEXT NOT NULL,
    "maternal_last_name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "phone_number" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "birthday" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "first_login" BOOLEAN NOT NULL,
    "role_id" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "patients" (
    "patient_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "curp" TEXT NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("patient_id")
);

-- CreateTable
CREATE TABLE "familiars" (
    "familiar_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,

    CONSTRAINT "familiars_pkey" PRIMARY KEY ("familiar_id")
);

-- CreateTable
CREATE TABLE "laboratorists" (
    "laboratorist_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "laboratorists_pkey" PRIMARY KEY ("laboratorist_id")
);

-- CreateTable
CREATE TABLE "doctors" (
    "doctor_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "specialty" CHAR(100) NOT NULL,
    "license" CHAR(20) NOT NULL,

    CONSTRAINT "doctors_pkey" PRIMARY KEY ("doctor_id")
);

-- CreateTable
CREATE TABLE "forums" (
    "forum_id" SERIAL NOT NULL,
    "name" CHAR(100) NOT NULL,
    "description" CHAR(255) NOT NULL,
    "public_status" BOOLEAN NOT NULL,
    "created_by" UUID NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forums_pkey" PRIMARY KEY ("forum_id")
);

-- CreateTable
CREATE TABLE "users_forums" (
    "user_id" UUID NOT NULL,
    "forum_id" INTEGER NOT NULL,
    "forum_role" "ForumRole" NOT NULL,

    CONSTRAINT "users_forums_pkey" PRIMARY KEY ("user_id","forum_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "message_id" SERIAL NOT NULL,
    "forum_id" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "publication_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parent_message_id" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "likes" (
    "like_id" SERIAL NOT NULL,
    "message_id" INTEGER NOT NULL,
    "user_id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("like_id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "appointment_id" SERIAL NOT NULL,
    "doctor_id" UUID NOT NULL,
    "name" CHAR(50) NOT NULL,
    "general_cost" DOUBLE PRECISION NOT NULL,
    "community_cost" DOUBLE PRECISION NOT NULL,
    "image_url" TEXT,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("appointment_id")
);

-- CreateTable
CREATE TABLE "patient_appointment" (
    "patient_appointment_id" SERIAL NOT NULL,
    "patient_id" UUID NOT NULL,
    "appointment_id" INTEGER NOT NULL,
    "date_hour" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "appointment_type" "Type" NOT NULL,
    "link" TEXT,
    "place" TEXT,
    "appointment_status" "Status" NOT NULL,

    CONSTRAINT "patient_appointment_pkey" PRIMARY KEY ("patient_appointment_id")
);

-- CreateTable
CREATE TABLE "notes" (
    "note_id" SERIAL NOT NULL,
    "patient_appointment_id" INTEGER,
    "title" CHAR(50) NOT NULL,
    "content" TEXT NOT NULL,
    "visibility" BOOLEAN NOT NULL DEFAULT true,
    "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("note_id")
);

-- CreateTable
CREATE TABLE "analysis" (
    "analysis_id" SERIAL NOT NULL,
    "name" CHAR(50) NOT NULL,
    "description" CHAR(500) NOT NULL,
    "previous_requirements" TEXT NOT NULL,
    "general_cost" DOUBLE PRECISION NOT NULL,
    "community_cost" DOUBLE PRECISION NOT NULL,
    "image_url" TEXT,

    CONSTRAINT "analysis_pkey" PRIMARY KEY ("analysis_id")
);

-- CreateTable
CREATE TABLE "patient_analysis" (
    "patient_analysis_id" SERIAL NOT NULL,
    "laboratorist_id" UUID NOT NULL,
    "analysis_id" INTEGER NOT NULL,
    "patient_id" UUID NOT NULL,
    "analysis_date" TIMESTAMP(3) NOT NULL,
    "results_date" TIMESTAMP(3) NOT NULL,
    "place" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "analysis_status" "ANALYSIS_STATUS" NOT NULL DEFAULT 'REQUESTED',

    CONSTRAINT "patient_analysis_pkey" PRIMARY KEY ("patient_analysis_id")
);

-- CreateTable
CREATE TABLE "results" (
    "result_id" SERIAL NOT NULL,
    "patient_analysis_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "path" CHAR(255) NOT NULL,
    "interpretation" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "results_pkey" PRIMARY KEY ("result_id")
);

-- CreateTable
CREATE TABLE "questions_history" (
    "question_id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "questions_history_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "patient_history" (
    "question_id" INTEGER NOT NULL,
    "patient_id" UUID NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "patient_history_pkey" PRIMARY KEY ("question_id","patient_id")
);

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
CREATE UNIQUE INDEX "patients_curp_key" ON "patients"("curp");

-- CreateIndex
CREATE UNIQUE INDEX "laboratorists_user_id_key" ON "laboratorists"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_user_id_key" ON "doctors"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_license_key" ON "doctors"("license");

-- CreateIndex
CREATE UNIQUE INDEX "forums_name_key" ON "forums"("name");

-- CreateIndex
CREATE UNIQUE INDEX "patient_appointment_appointment_id_key" ON "patient_appointment"("appointment_id");

-- CreateIndex
CREATE UNIQUE INDEX "notes_patient_appointment_id_key" ON "notes"("patient_appointment_id");

-- CreateIndex
CREATE UNIQUE INDEX "analysis_name_key" ON "analysis"("name");

-- CreateIndex
CREATE UNIQUE INDEX "results_patient_analysis_id_key" ON "results"("patient_analysis_id");

-- AddForeignKey
ALTER TABLE "role_privilege" ADD CONSTRAINT "role_privilege_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_privilege" ADD CONSTRAINT "role_privilege_privilege_id_fkey" FOREIGN KEY ("privilege_id") REFERENCES "privileges"("privilege_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familiars" ADD CONSTRAINT "familiars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "familiars" ADD CONSTRAINT "familiars_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "laboratorists" ADD CONSTRAINT "laboratorists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctors" ADD CONSTRAINT "doctors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forums" ADD CONSTRAINT "forums_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_forums" ADD CONSTRAINT "users_forums_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_forums" ADD CONSTRAINT "users_forums_forum_id_fkey" FOREIGN KEY ("forum_id") REFERENCES "forums"("forum_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_forum_id_fkey" FOREIGN KEY ("forum_id") REFERENCES "forums"("forum_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_parent_message_id_fkey" FOREIGN KEY ("parent_message_id") REFERENCES "messages"("message_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "messages"("message_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("doctor_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_appointment" ADD CONSTRAINT "patient_appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_appointment" ADD CONSTRAINT "patient_appointment_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("appointment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_patient_appointment_id_fkey" FOREIGN KEY ("patient_appointment_id") REFERENCES "patient_appointment"("patient_appointment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_analysis" ADD CONSTRAINT "patient_analysis_laboratorist_id_fkey" FOREIGN KEY ("laboratorist_id") REFERENCES "laboratorists"("laboratorist_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_analysis" ADD CONSTRAINT "patient_analysis_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "analysis"("analysis_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_analysis" ADD CONSTRAINT "patient_analysis_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "results" ADD CONSTRAINT "results_patient_analysis_id_fkey" FOREIGN KEY ("patient_analysis_id") REFERENCES "patient_analysis"("patient_analysis_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_history" ADD CONSTRAINT "patient_history_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions_history"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "patient_history" ADD CONSTRAINT "patient_history_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("patient_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_reports" ADD CONSTRAINT "user_reports_reported_message_fkey" FOREIGN KEY ("reported_message") REFERENCES "messages"("message_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_reports" ADD CONSTRAINT "user_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
