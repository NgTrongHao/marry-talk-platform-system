/*
  Warnings:

  - You are about to drop the column `expired_at` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `reference_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `TransactionHistory` table. All the data in the column will be lost.
  - You are about to drop the `_PremaritalTestQuestions` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sessions]` on the table `ServicePackage` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[therapist_id,package_id]` on the table `TherapistService` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reference_transaction_id]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reference_refund_id]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reference_withdraw_id]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expires_at` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `therapist_service_id` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `therapy_id` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `premarital_test_id` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question_no` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_time` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_time` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time_duration` to the `TherapistService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference_transaction_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payout_account_id` to the `WithdrawRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "TransactionStatus" ADD VALUE 'CANCELLED';

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_therapist_id_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "payment";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "refundRequest";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "withdrawRequest";

-- DropForeignKey
ALTER TABLE "_PremaritalTestQuestions" DROP CONSTRAINT "_PremaritalTestQuestions_A_fkey";

-- DropForeignKey
ALTER TABLE "_PremaritalTestQuestions" DROP CONSTRAINT "_PremaritalTestQuestions_B_fkey";

-- DropIndex
DROP INDEX "Transaction_reference_id_key";

-- DropIndex
DROP INDEX "TransactionHistory_changed_by_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "expired_at",
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "therapist_service_id" TEXT NOT NULL,
ADD COLUMN     "therapy_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "options",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "premarital_test_id" TEXT NOT NULL,
ADD COLUMN     "question_no" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "end_time" TEXT NOT NULL,
ADD COLUMN     "start_time" TEXT NOT NULL,
ALTER COLUMN "therapist_id" DROP NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TherapistService" ADD COLUMN     "time_duration" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "reference_id",
ADD COLUMN     "changed_by" TEXT,
ADD COLUMN     "reference_payment_id" TEXT,
ADD COLUMN     "reference_refund_id" TEXT,
ADD COLUMN     "reference_transaction_id" TEXT NOT NULL,
ADD COLUMN     "reference_withdraw_id" TEXT,
ADD COLUMN     "return_url" TEXT;

-- AlterTable
ALTER TABLE "TransactionHistory" DROP COLUMN "note",
ADD COLUMN     "reference_transaction_info" JSONB,
ALTER COLUMN "old_status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WithdrawRequest" ADD COLUMN     "payout_account_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "_PremaritalTestQuestions";

-- CreateTable
CREATE TABLE "TherapistPayoutAccount" (
    "id" TEXT NOT NULL,
    "therapist_id" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "bank_code" TEXT,
    "account_name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TherapistPayoutAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TherapistBalance" (
    "therapist_id" TEXT NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0.0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TherapistBalance_pkey" PRIMARY KEY ("therapist_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TherapistBalance_therapist_id_key" ON "TherapistBalance"("therapist_id");

-- CreateIndex
CREATE INDEX "Booking_therapy_id_idx" ON "Booking"("therapy_id");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ServicePackage_sessions_key" ON "ServicePackage"("sessions");

-- CreateIndex
CREATE UNIQUE INDEX "TherapistService_therapist_id_package_id_key" ON "TherapistService"("therapist_id", "package_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_transaction_id_key" ON "Transaction"("reference_transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_refund_id_key" ON "Transaction"("reference_refund_id");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_withdraw_id_key" ON "Transaction"("reference_withdraw_id");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_premarital_test_id_fkey" FOREIGN KEY ("premarital_test_id") REFERENCES "PremaritalTest"("test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_therapy_id_fkey" FOREIGN KEY ("therapy_id") REFERENCES "Therapy"("therapy_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_therapist_service_id_fkey" FOREIGN KEY ("therapist_service_id") REFERENCES "TherapistService"("therapist_service_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "payment" FOREIGN KEY ("reference_payment_id") REFERENCES "Booking"("booking_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "refundRequest" FOREIGN KEY ("reference_refund_id") REFERENCES "RefundRequest"("request_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "withdrawRequest" FOREIGN KEY ("reference_withdraw_id") REFERENCES "WithdrawRequest"("request_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawRequest" ADD CONSTRAINT "WithdrawRequest_payout_account_id_fkey" FOREIGN KEY ("payout_account_id") REFERENCES "TherapistPayoutAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapistPayoutAccount" ADD CONSTRAINT "TherapistPayoutAccount_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapistBalance" ADD CONSTRAINT "TherapistBalance_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
