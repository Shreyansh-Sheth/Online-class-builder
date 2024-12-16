/*
  Warnings:

  - A unique constraint covering the columns `[notesId]` on the table `Content` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Notes" DROP CONSTRAINT "Notes_contentId_fkey";

-- DropIndex
DROP INDEX "Notes_contentId_key";

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "notesId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Content_notesId_key" ON "Content"("notesId");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_notesId_fkey" FOREIGN KEY ("notesId") REFERENCES "Notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
