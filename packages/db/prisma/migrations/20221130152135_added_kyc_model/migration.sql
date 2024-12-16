-- CreateEnum
CREATE TYPE "KycStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "Kyc" (
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "status" "KycStatus" NOT NULL,
    "reason" TEXT,

    CONSTRAINT "Kyc_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Kyc" ADD CONSTRAINT "Kyc_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
