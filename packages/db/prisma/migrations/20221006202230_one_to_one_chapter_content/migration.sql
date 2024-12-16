/*
  Warnings:

  - A unique constraint covering the columns `[chapterId]` on the table `Content` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contentId` to the `Chapter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "contentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Content_chapterId_key" ON "Content"("chapterId");
