/*
  Warnings:

  - A unique constraint covering the columns `[videoId]` on the table `Content` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "videoId" TEXT;

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coursesId" TEXT NOT NULL,
    "contentId" TEXT,
    "fileKey" TEXT NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EndUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailSendExpiryTime" TIMESTAMP(3) NOT NULL,
    "forgotPasswordExpiryTime" TIMESTAMP(3) NOT NULL,
    "storeFrontId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EndUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EndUser_email_storeFrontId_key" ON "EndUser"("email", "storeFrontId");

-- CreateIndex
CREATE UNIQUE INDEX "Content_videoId_key" ON "Content"("videoId");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_fileKey_fkey" FOREIGN KEY ("fileKey") REFERENCES "File"("key") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_coursesId_fkey" FOREIGN KEY ("coursesId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EndUser" ADD CONSTRAINT "EndUser_storeFrontId_fkey" FOREIGN KEY ("storeFrontId") REFERENCES "StoreFront"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
