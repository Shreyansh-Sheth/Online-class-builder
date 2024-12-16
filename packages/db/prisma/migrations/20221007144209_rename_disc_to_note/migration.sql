/*
  Warnings:

  - You are about to drop the column `description` on the `Notes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Notes" DROP COLUMN "description",
ADD COLUMN     "note" TEXT;
