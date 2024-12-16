-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_downloadableId_fkey";

-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "downloadableId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_downloadableId_fkey" FOREIGN KEY ("downloadableId") REFERENCES "Downloadable"("id") ON DELETE SET NULL ON UPDATE CASCADE;
