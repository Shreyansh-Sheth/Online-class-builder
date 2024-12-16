/*
  Warnings:

  - The primary key for the `Kyc` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId]` on the table `Kyc` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Kyc` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Kyc" DROP CONSTRAINT "Kyc_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Kyc_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Kyc_userId_key" ON "Kyc"("userId");
