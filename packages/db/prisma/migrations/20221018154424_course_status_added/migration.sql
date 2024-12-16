-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Courses" ADD COLUMN     "status" "CourseStatus" NOT NULL DEFAULT 'INACTIVE';
