-- AlterTable
ALTER TABLE "EndUser" ALTER COLUMN "emailSendExpiryTime" DROP NOT NULL,
ALTER COLUMN "forgotPasswordExpiryTime" DROP NOT NULL;
