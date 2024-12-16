/*
  Warnings:

  - Added the required column `fileKey` to the `Courses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Courses" ADD COLUMN     "fileKey" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Courses" ADD CONSTRAINT "Courses_fileKey_fkey" FOREIGN KEY ("fileKey") REFERENCES "File"("key") ON DELETE RESTRICT ON UPDATE CASCADE;
