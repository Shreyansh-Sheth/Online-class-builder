/*
  Warnings:

  - You are about to drop the column `readyToStream` on the `Video` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "streamStatus" AS ENUM ('PROCESSING', 'READY_TO_STREAM', 'ERROR');

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "readyToStream",
ADD COLUMN     "StreamStatus" "streamStatus" NOT NULL DEFAULT 'PROCESSING';

-- CreateIndex
CREATE INDEX "streamUid" ON "Video"("streamUid");
