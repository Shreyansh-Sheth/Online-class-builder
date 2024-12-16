/*
  Warnings:

  - Added the required column `sellersCut` to the `purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "purchase" ADD COLUMN     "sellersCut" INTEGER NOT NULL;
