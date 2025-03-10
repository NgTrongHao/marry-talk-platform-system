-- CreateEnum
CREATE TYPE "Role" AS ENUM ('REGISTRAR', 'MEMBER', 'THERAPIST', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PAYMENT', 'REFUND', 'WITHDRAW');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'WARNING', 'ERROR');

-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TEXT');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('PLATFORM_ISSUE', 'SERVICE_ISSUE');

-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT,
    "avatar_image" TEXT,
    "bio" TEXT,
    "expert_certificate" TEXT[],
    "professional_experience" TEXT,
    "password" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3),
    "enable_status" BOOLEAN NOT NULL DEFAULT true,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "role_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receiver_id" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateTable
CREATE TABLE "Therapy" (
    "therapy_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Therapy_pkey" PRIMARY KEY ("therapy_id")
);

-- CreateTable
CREATE TABLE "TherapistType" (
    "therapist_id" TEXT NOT NULL,
    "therapy_id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TherapistType_pkey" PRIMARY KEY ("therapist_id","therapy_id")
);

-- CreateTable
CREATE TABLE "PremaritalTest" (
    "test_id" TEXT NOT NULL,
    "test_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PremaritalTest_pkey" PRIMARY KEY ("test_id")
);

-- CreateTable
CREATE TABLE "TherapyTest" (
    "therapy_id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,

    CONSTRAINT "TherapyTest_pkey" PRIMARY KEY ("therapy_id","test_id")
);

-- CreateTable
CREATE TABLE "Question" (
    "question_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "options" TEXT[],

    CONSTRAINT "Question_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "answer_id" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "question_id" TEXT NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("answer_id")
);

-- CreateTable
CREATE TABLE "TestResult" (
    "result_id" TEXT NOT NULL,
    "total_score" DECIMAL(65,30) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_response" JSONB NOT NULL,
    "user_id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,

    CONSTRAINT "TestResult_pkey" PRIMARY KEY ("result_id")
);

-- CreateTable
CREATE TABLE "ServicePackage" (
    "package_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sessions" INTEGER NOT NULL,

    CONSTRAINT "ServicePackage_pkey" PRIMARY KEY ("package_id")
);

-- CreateTable
CREATE TABLE "TherapistService" (
    "therapist_service_id" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "description" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "therapist_id" TEXT NOT NULL,
    "therapy_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,

    CONSTRAINT "TherapistService_pkey" PRIMARY KEY ("therapist_service_id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "booking_id" TEXT NOT NULL,
    "therapist_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "package_id" TEXT NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "Session" (
    "session_id" TEXT NOT NULL,
    "session_number" INTEGER NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'PENDING',
    "session_date" TIMESTAMP(3) NOT NULL,
    "meeting_link" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "therapist_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("session_id")
);

-- CreateTable
CREATE TABLE "SessionNote" (
    "note_id" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "reply_for" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "session_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "SessionNote_pkey" PRIMARY KEY ("note_id")
);

-- CreateTable
CREATE TABLE "Report" (
    "report_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "report_by" TEXT NOT NULL,
    "report_for" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("report_id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "transaction_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "type" "TransactionType" NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "reference_id" TEXT NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "TransactionHistory" (
    "history_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "type" "TransactionType" NOT NULL,
    "old_status" "TransactionStatus" NOT NULL,
    "new_status" "TransactionStatus" NOT NULL,
    "note" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changed_by" TEXT NOT NULL,

    CONSTRAINT "TransactionHistory_pkey" PRIMARY KEY ("history_id")
);

-- CreateTable
CREATE TABLE "WithdrawRequest" (
    "request_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "therapist_id" TEXT NOT NULL,

    CONSTRAINT "WithdrawRequest_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "RefundRequest" (
    "request_id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'VND',
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "report_id" TEXT NOT NULL,

    CONSTRAINT "RefundRequest_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "WorkingSchedule" (
    "id" TEXT NOT NULL,
    "therapist_id" TEXT NOT NULL,

    CONSTRAINT "WorkingSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkTime" (
    "id" TEXT NOT NULL,
    "schedule_id" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "WorkTime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnavailableSchedule" (
    "id" TEXT NOT NULL,
    "therapist_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "fullDay" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT,

    CONSTRAINT "UnavailableSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PremaritalTestQuestions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PremaritalTestQuestions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_user_id_idx" ON "User"("user_id");

-- CreateIndex
CREATE INDEX "Notification_receiver_id_notification_id_idx" ON "Notification"("receiver_id", "notification_id");

-- CreateIndex
CREATE INDEX "PremaritalTest_test_id_idx" ON "PremaritalTest"("test_id");

-- CreateIndex
CREATE INDEX "Answer_question_id_idx" ON "Answer"("question_id");

-- CreateIndex
CREATE INDEX "TestResult_result_id_idx" ON "TestResult"("result_id");

-- CreateIndex
CREATE INDEX "TestResult_user_id_idx" ON "TestResult"("user_id");

-- CreateIndex
CREATE INDEX "TestResult_test_id_idx" ON "TestResult"("test_id");

-- CreateIndex
CREATE INDEX "TherapistService_therapist_id_idx" ON "TherapistService"("therapist_id");

-- CreateIndex
CREATE INDEX "TherapistService_therapy_id_idx" ON "TherapistService"("therapy_id");

-- CreateIndex
CREATE INDEX "Booking_therapist_id_idx" ON "Booking"("therapist_id");

-- CreateIndex
CREATE INDEX "Booking_user_id_idx" ON "Booking"("user_id");

-- CreateIndex
CREATE INDEX "Booking_package_id_idx" ON "Booking"("package_id");

-- CreateIndex
CREATE INDEX "Session_booking_id_idx" ON "Session"("booking_id");

-- CreateIndex
CREATE INDEX "Session_therapist_id_idx" ON "Session"("therapist_id");

-- CreateIndex
CREATE INDEX "Session_user_id_idx" ON "Session"("user_id");

-- CreateIndex
CREATE INDEX "SessionNote_session_id_idx" ON "SessionNote"("session_id");

-- CreateIndex
CREATE INDEX "Report_report_by_idx" ON "Report"("report_by");

-- CreateIndex
CREATE INDEX "Report_report_for_idx" ON "Report"("report_for");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_reference_id_key" ON "Transaction"("reference_id");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionHistory_changed_by_key" ON "TransactionHistory"("changed_by");

-- CreateIndex
CREATE INDEX "WithdrawRequest_therapist_id_idx" ON "WithdrawRequest"("therapist_id");

-- CreateIndex
CREATE INDEX "WithdrawRequest_status_idx" ON "WithdrawRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "RefundRequest_report_id_key" ON "RefundRequest"("report_id");

-- CreateIndex
CREATE INDEX "RefundRequest_user_id_idx" ON "RefundRequest"("user_id");

-- CreateIndex
CREATE INDEX "RefundRequest_report_id_idx" ON "RefundRequest"("report_id");

-- CreateIndex
CREATE INDEX "RefundRequest_status_idx" ON "RefundRequest"("status");

-- CreateIndex
CREATE INDEX "WorkTime_schedule_id_dayOfWeek_idx" ON "WorkTime"("schedule_id", "dayOfWeek");

-- CreateIndex
CREATE INDEX "UnavailableSchedule_therapist_id_date_idx" ON "UnavailableSchedule"("therapist_id", "date");

-- CreateIndex
CREATE INDEX "_PremaritalTestQuestions_B_index" ON "_PremaritalTestQuestions"("B");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapistType" ADD CONSTRAINT "TherapistType_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapistType" ADD CONSTRAINT "TherapistType_therapy_id_fkey" FOREIGN KEY ("therapy_id") REFERENCES "Therapy"("therapy_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapyTest" ADD CONSTRAINT "TherapyTest_therapy_id_fkey" FOREIGN KEY ("therapy_id") REFERENCES "Therapy"("therapy_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapyTest" ADD CONSTRAINT "TherapyTest_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "PremaritalTest"("test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResult" ADD CONSTRAINT "TestResult_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "PremaritalTest"("test_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapistService" ADD CONSTRAINT "TherapistService_therapist_id_therapy_id_fkey" FOREIGN KEY ("therapist_id", "therapy_id") REFERENCES "TherapistType"("therapist_id", "therapy_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TherapistService" ADD CONSTRAINT "TherapistService_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "ServicePackage"("package_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "ServicePackage"("package_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "Booking"("booking_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionNote" ADD CONSTRAINT "SessionNote_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionNote" ADD CONSTRAINT "SessionNote_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_report_by_fkey" FOREIGN KEY ("report_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_report_for_fkey" FOREIGN KEY ("report_for") REFERENCES "Session"("session_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "payment" FOREIGN KEY ("reference_id") REFERENCES "Booking"("booking_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "refundRequest" FOREIGN KEY ("reference_id") REFERENCES "RefundRequest"("request_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "withdrawRequest" FOREIGN KEY ("reference_id") REFERENCES "WithdrawRequest"("request_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "Transaction"("transaction_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawRequest" ADD CONSTRAINT "WithdrawRequest_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefundRequest" ADD CONSTRAINT "RefundRequest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefundRequest" ADD CONSTRAINT "RefundRequest_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "Report"("report_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkingSchedule" ADD CONSTRAINT "WorkingSchedule_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkTime" ADD CONSTRAINT "WorkTime_schedule_id_fkey" FOREIGN KEY ("schedule_id") REFERENCES "WorkingSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnavailableSchedule" ADD CONSTRAINT "UnavailableSchedule_therapist_id_fkey" FOREIGN KEY ("therapist_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PremaritalTestQuestions" ADD CONSTRAINT "_PremaritalTestQuestions_A_fkey" FOREIGN KEY ("A") REFERENCES "PremaritalTest"("test_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PremaritalTestQuestions" ADD CONSTRAINT "_PremaritalTestQuestions_B_fkey" FOREIGN KEY ("B") REFERENCES "Question"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;
