-- CreateTable
CREATE TABLE "CourseContentJSON" (
    "coursesId" TEXT NOT NULL,
    "data" JSONB
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseContentJSON_coursesId_key" ON "CourseContentJSON"("coursesId");

-- AddForeignKey
ALTER TABLE "CourseContentJSON" ADD CONSTRAINT "CourseContentJSON_coursesId_fkey" FOREIGN KEY ("coursesId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
