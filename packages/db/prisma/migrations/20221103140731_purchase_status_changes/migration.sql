/*
  Warnings:

  - The values [attempted] on the enum `PURCHASE_STATUS` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PURCHASE_STATUS_new" AS ENUM ('created', 'paid', 'failed');
ALTER TABLE "purchase" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "purchase" ALTER COLUMN "status" TYPE "PURCHASE_STATUS_new" USING ("status"::text::"PURCHASE_STATUS_new");
ALTER TYPE "PURCHASE_STATUS" RENAME TO "PURCHASE_STATUS_old";
ALTER TYPE "PURCHASE_STATUS_new" RENAME TO "PURCHASE_STATUS";
DROP TYPE "PURCHASE_STATUS_old";
ALTER TABLE "purchase" ALTER COLUMN "status" SET DEFAULT 'created';
COMMIT;

-- AlterTable
ALTER TABLE "purchase" ADD COLUMN     "localVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "webHookVerified" BOOLEAN NOT NULL DEFAULT false;
