-- CreateEnum
CREATE TYPE "PURCHASE_STATUS" AS ENUM ('created', 'attempted', 'paid');

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDemo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Domain" ALTER COLUMN "isPremium" SET DEFAULT false;

-- CreateTable
CREATE TABLE "purchase" (
    "id" TEXT NOT NULL,
    "endUserId" TEXT NOT NULL,
    "storeFrontId" TEXT NOT NULL,
    "coursesId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "PURCHASE_STATUS" NOT NULL DEFAULT 'created',
    "metaData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "purchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "purchase_orderId_idx" ON "purchase"("orderId");

-- CreateIndex
CREATE INDEX "purchase_paymentId_idx" ON "purchase"("paymentId");

-- CreateIndex
CREATE INDEX "purchase_endUserId_idx" ON "purchase"("endUserId");

-- AddForeignKey
ALTER TABLE "purchase" ADD CONSTRAINT "purchase_endUserId_fkey" FOREIGN KEY ("endUserId") REFERENCES "EndUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase" ADD CONSTRAINT "purchase_storeFrontId_fkey" FOREIGN KEY ("storeFrontId") REFERENCES "StoreFront"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase" ADD CONSTRAINT "purchase_coursesId_fkey" FOREIGN KEY ("coursesId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
