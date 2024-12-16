-- CreateTable
CREATE TABLE "File" (
    "key" TEXT NOT NULL,
    "isUploaded" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "mime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "File_pkey" PRIMARY KEY ("key")
);
