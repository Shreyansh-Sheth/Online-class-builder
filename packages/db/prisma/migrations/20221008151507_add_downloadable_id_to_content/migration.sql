/*
  Warnings:

  - A unique constraint covering the columns `[downloadableId]` on the table `Content` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `downloadableId` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "downloadableId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "downloadableId" TEXT;

-- CreateTable
CREATE TABLE "Downloadable" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "coursesId" TEXT NOT NULL,
    "contentId" TEXT,

    CONSTRAINT "Downloadable_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Content_downloadableId_key" ON "Content"("downloadableId");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_downloadableId_fkey" FOREIGN KEY ("downloadableId") REFERENCES "Downloadable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Downloadable" ADD CONSTRAINT "Downloadable_coursesId_fkey" FOREIGN KEY ("coursesId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_downloadableId_fkey" FOREIGN KEY ("downloadableId") REFERENCES "Downloadable"("id") ON DELETE SET NULL ON UPDATE CASCADE;
