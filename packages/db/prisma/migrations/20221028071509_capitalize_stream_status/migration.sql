/*
  Warnings:

  - The `StreamStatus` column on the `Video` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "STREAM_STATUS" AS ENUM ('PROCESSING', 'READY_TO_STREAM', 'ERROR');

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "StreamStatus",
ADD COLUMN     "StreamStatus" "STREAM_STATUS" NOT NULL DEFAULT 'PROCESSING';

-- DropEnum
DROP TYPE "streamStatus";
