/*
  Warnings:

  - A unique constraint covering the columns `[storeFrontPaymentProcessingDetailsId]` on the table `StoreFront` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "StoreFrontStatus" ADD VALUE 'HOLD';

-- AlterTable
ALTER TABLE "StoreFront" ADD COLUMN     "storeFrontPaymentProcessingDetailsId" TEXT;

-- CreateTable
CREATE TABLE "storeFrontPaymentProcessingDetails" (
    "id" TEXT NOT NULL,
    "percentCut" INTEGER NOT NULL DEFAULT 20,
    "storeFrontId" TEXT NOT NULL,
    "razorpayAccountId" TEXT,

    CONSTRAINT "storeFrontPaymentProcessingDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "storeFrontPaymentProcessingDetails_storeFrontId_key" ON "storeFrontPaymentProcessingDetails"("storeFrontId");

-- CreateIndex
CREATE UNIQUE INDEX "StoreFront_storeFrontPaymentProcessingDetailsId_key" ON "StoreFront"("storeFrontPaymentProcessingDetailsId");

-- AddForeignKey
ALTER TABLE "StoreFront" ADD CONSTRAINT "StoreFront_storeFrontPaymentProcessingDetailsId_fkey" FOREIGN KEY ("storeFrontPaymentProcessingDetailsId") REFERENCES "storeFrontPaymentProcessingDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
