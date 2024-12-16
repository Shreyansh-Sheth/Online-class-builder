-- AlterEnum
ALTER TYPE "CONTENT_TYPE" ADD VALUE 'QUIZ';

-- CreateTable
CREATE TABLE "Notes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coursesId" TEXT NOT NULL,
    "contentId" TEXT,

    CONSTRAINT "Notes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Notes_contentId_key" ON "Notes"("contentId");

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_coursesId_fkey" FOREIGN KEY ("coursesId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notes" ADD CONSTRAINT "Notes_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE SET NULL ON UPDATE CASCADE;
