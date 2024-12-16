/*
  Warnings:

  - You are about to drop the column `iconUrl` on the `StoreFront` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "StoreFront" DROP COLUMN "iconUrl",
ADD COLUMN     "fileKey" TEXT;

-- AddForeignKey
ALTER TABLE "StoreFront" ADD CONSTRAINT "StoreFront_fileKey_fkey" FOREIGN KEY ("fileKey") REFERENCES "File"("key") ON DELETE SET NULL ON UPDATE CASCADE;
