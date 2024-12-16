/*
  Warnings:

  - You are about to drop the column `data` on the `CourseContentJSON` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CourseContentJSON" DROP COLUMN "data",
ADD COLUMN     "json" JSONB;
