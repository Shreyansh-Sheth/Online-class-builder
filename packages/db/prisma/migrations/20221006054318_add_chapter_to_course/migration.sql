-- CreateEnum
CREATE TYPE "CHAPTER_STATUS" AS ENUM ('DISABLE', 'ENABLE');

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "CHAPTER_STATUS" NOT NULL DEFAULT 'ENABLE',
    "description" TEXT,
    "coursesId" TEXT NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_coursesId_fkey" FOREIGN KEY ("coursesId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
