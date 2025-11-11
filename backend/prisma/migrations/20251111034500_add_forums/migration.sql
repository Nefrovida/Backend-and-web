/*
  Warnings:

  - You are about to drop the column `name` on the `forums` table. All the data in the column will be lost.
  - You are about to drop the column `public_status` on the `forums` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `forums` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `forums` table. All the data in the column will be lost.
  - The primary key for the `forums` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `forum_id` on the `forums` table. The data in that column could be lost. The data in that column will be cast from `Int` to `String`.
  - Added the required column `title` to the `forums` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by_id` to the `forums` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `forums` table without a default value. This is not possible if the table is not empty.
  - You are about to alter the column `forum_id` on the `users_forums` table. The data in that column could be lost. The data in that column will be cast from `Int` to `String`.
  - You are about to alter the column `forum_id` on the `messages` table. The data in that column could be lost. The data in that column will be cast from `Int` to `String`.

*/
-- CreateEnum (only if not exists)
DO $$ BEGIN
  CREATE TYPE "Visibility" AS ENUM ('PUBLIC', 'PRIVATE');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- DropForeignKey
ALTER TABLE "forums" DROP CONSTRAINT IF EXISTS "forums_created_by_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT IF EXISTS "messages_forum_id_fkey";

-- DropForeignKey
ALTER TABLE "users_forums" DROP CONSTRAINT IF EXISTS "users_forums_forum_id_fkey";

-- DropIndex
DROP INDEX IF EXISTS "forums_name_key";

-- AlterTable: Convert forum_id from INT to TEXT (using a temp column strategy)
ALTER TABLE "forums" ADD COLUMN "forum_id_new" TEXT;
UPDATE "forums" SET "forum_id_new" = 'forum_' || "forum_id"::TEXT;

ALTER TABLE "users_forums" ADD COLUMN "forum_id_new" TEXT;
UPDATE "users_forums" SET "forum_id_new" = 'forum_' || "forum_id"::TEXT;

ALTER TABLE "messages" ADD COLUMN "forum_id_new" TEXT;
UPDATE "messages" SET "forum_id_new" = 'forum_' || "forum_id"::TEXT;

-- Drop old foreign key columns
ALTER TABLE "forums" DROP CONSTRAINT "forums_pkey";
ALTER TABLE "users_forums" DROP CONSTRAINT "users_forums_pkey";

ALTER TABLE "forums" DROP COLUMN "forum_id";
ALTER TABLE "users_forums" DROP COLUMN "forum_id";
ALTER TABLE "messages" DROP COLUMN "forum_id";

-- Rename new columns
ALTER TABLE "forums" RENAME COLUMN "forum_id_new" TO "forum_id";
ALTER TABLE "users_forums" RENAME COLUMN "forum_id_new" TO "forum_id";
ALTER TABLE "messages" RENAME COLUMN "forum_id_new" TO "forum_id";

-- Make forum_id NOT NULL in messages
ALTER TABLE "messages" ALTER COLUMN "forum_id" SET NOT NULL;

-- Add primary keys back
ALTER TABLE "forums" ADD CONSTRAINT "forums_pkey" PRIMARY KEY ("forum_id");
ALTER TABLE "users_forums" ADD CONSTRAINT "users_forums_pkey" PRIMARY KEY ("user_id", "forum_id");

-- Drop sequence
DROP SEQUENCE IF EXISTS "forums_forum_id_seq";

-- Update forums table structure
ALTER TABLE "forums" 
  RENAME COLUMN "name" TO "title";

-- Change title from CHAR to TEXT
ALTER TABLE "forums"
  ALTER COLUMN "title" SET DATA TYPE TEXT;

ALTER TABLE "forums"
  DROP COLUMN IF EXISTS "public_status",
  DROP COLUMN IF EXISTS "created_by",
  DROP COLUMN IF EXISTS "active",
  ALTER COLUMN "description" DROP NOT NULL,
  ALTER COLUMN "description" SET DATA TYPE TEXT,
  ADD COLUMN "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
  ADD COLUMN "created_by_id" UUID,
  ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update created_by_id with existing user (first available user)
UPDATE "forums" SET "created_by_id" = (SELECT "user_id" FROM "users" LIMIT 1) WHERE "created_by_id" IS NULL;

-- Make created_by_id NOT NULL after populating
ALTER TABLE "forums" ALTER COLUMN "created_by_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "forums" ADD CONSTRAINT "forums_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_forums" ADD CONSTRAINT "users_forums_forum_id_fkey" FOREIGN KEY ("forum_id") REFERENCES "forums"("forum_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_forum_id_fkey" FOREIGN KEY ("forum_id") REFERENCES "forums"("forum_id") ON DELETE CASCADE ON UPDATE CASCADE;
