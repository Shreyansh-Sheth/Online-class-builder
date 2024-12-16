/*
  Warnings:

  - A unique constraint covering the columns `[streamUid]` on the table `Video` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Video_streamUid_key" ON "Video"("streamUid");
