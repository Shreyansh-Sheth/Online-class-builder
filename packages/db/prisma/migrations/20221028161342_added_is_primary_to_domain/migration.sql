/*
  Warnings:

  - A unique constraint covering the columns `[isPrimary,storeFrontId]` on the table `Domain` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Domain" ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Domain_isPrimary_storeFrontId_key" ON "Domain"("isPrimary", "storeFrontId");
