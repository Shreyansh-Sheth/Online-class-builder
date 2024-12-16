/*
  Warnings:

  - Made the column `note` on table `Notes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Notes" ALTER COLUMN "note" SET NOT NULL;
