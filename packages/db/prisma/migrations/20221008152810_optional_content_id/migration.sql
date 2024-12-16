-- AlterTable
ALTER TABLE "Chapter" ALTER COLUMN "contentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Downloadable" ALTER COLUMN "contentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Notes" ALTER COLUMN "contentId" DROP NOT NULL;
