/*
  Warnings:

  - Made the column `contentId` on table `Chapter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contentId` on table `Downloadable` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contentId` on table `Notes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Chapter" ALTER COLUMN "contentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Downloadable" ALTER COLUMN "contentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Notes" ALTER COLUMN "contentId" SET NOT NULL;
