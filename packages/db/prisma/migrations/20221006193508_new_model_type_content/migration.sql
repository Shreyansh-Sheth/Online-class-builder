/*
  Warnings:

  - You are about to drop the column `status` on the `Chapter` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CONTENT_STATUS" AS ENUM ('DISABLE', 'ENABLE');

-- CreateEnum
CREATE TYPE "CONTENT_TYPE" AS ENUM ('CHAPTER', 'VIDEO', 'NOTES', 'DOWNLOADABLE');

-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "status";

-- DropEnum
DROP TYPE "CHAPTER_STATUS";

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "type" "CONTENT_TYPE" NOT NULL,
    "status" "CONTENT_STATUS" NOT NULL DEFAULT 'DISABLE',
    "chapterId" TEXT,
    "coursesId" TEXT NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_coursesId_fkey" FOREIGN KEY ("coursesId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
