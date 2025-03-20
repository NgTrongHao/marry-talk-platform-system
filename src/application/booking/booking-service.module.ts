import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { TherapyManagementServiceModule } from '../therapy-management/therapy-management-service.module';
import { UsecaseHandler } from '../usecase-handler.service';
import { BookingService } from './service/booking.service';
import { ServicePackageManagementServiceModule } from '../service-package-management/service-package-management-service.module';
import { CreateBookingUsecase } from './service/usecase/create-booking.usecase';
import { ProcessBookingPaymentUsecase } from './service/usecase/process-booking-payment.usecase';
import { CreatePaymentTransactionUsecase } from './service/usecase/create-payment-transaction.usecase';
import { AddTransactionHistoryUsecase } from './service/usecase/add-transaction-history.usecase';
import { UserServiceModule } from '../user/user-service.module';
import { HandlePaymentResultUsecase } from './service/usecase/handle-payment-result.usecase';
import { GetBookingByIdUsecase } from './service/usecase/get-booking-by-id.usecase';
import { TherapistManagementServiceModule } from '../therapist-management/therapist-management-service.module';
import { GetSessionsOfBookingUsecase } from './service/usecase/get-sessions-of-booking.usecase';
import { AddTherapySessionUsecase } from './service/usecase/add-therapy-session.usecase';
import { CheckExistSessionInTimeUsecase } from './service/usecase/check-exist-session-in-time.usecase';
import { ValidateTherapySessionUsecase } from './service/usecase/validate-therapy-session.usecase';
import { CancelTherapySessionUsecase } from './service/usecase/cancel-therapy-session.usecase';
import { GetTherapySessionsByTherapistIdUsecase } from './service/usecase/get-therapy-sessions-by-therapist-id.usecase';
import { CompleteTherapySessionUsecase } from './service/usecase/complete-therapy-session.usecase';
import { CompleteBookingUsecase } from './service/usecase/complete-booking.usecase';
import { CreateSessionReportUsecase } from './service/usecase/create-session-report.usecase';
import { GetTherapySessionByIdUsecase } from './service/usecase/get-therapy-session-by-id.usecase';
import { GetAllSessionReportsUsecase } from './service/usecase/get-all-session-reports.usecase';
import { ApproveSessionReportUsecase } from './service/usecase/approve-session-report.usecase';
import { RejectSessionReportUsecase } from './service/usecase/reject-session-report.usecase';
import { GetSessionReportsByUserIdUsecase } from './service/usecase/get-session-reports-by-user-id.usecase';
import { GetTherapistSessionReportsUsecase } from './service/usecase/get-therapist-session-reports.usecase';
import { GetSessionReportByIdUsecase } from './service/usecase/get-session-report-by-id.usecase';
import { GetTherapistBookingsUsecase } from './service/usecase/get-therapist-bookings.usecase';
import { GetMemberBookingsUsecase } from './service/usecase/get-member-bookings.usecase';
import { CountMemberBookingsUsecase } from './service/usecase/count-member-bookings.usecase';
import { CountTherapistBookingsUsecase } from './service/usecase/count-therapist-bookings.usecase';
import { GetTherapySessionByUserIdUsecase } from './service/usecase/get-therapy-session-by-user-id.usecase';
import { RateBookingUsecase } from './service/usecase/rate-booking.usecase';
import { CleanupExpiredSessionsUsecase } from './service/usecase/cleanup-expired-sessions.usecase';

const useCases = [
  CreateBookingUsecase,
  ProcessBookingPaymentUsecase,
  CreatePaymentTransactionUsecase,
  AddTransactionHistoryUsecase,
  HandlePaymentResultUsecase,
  GetBookingByIdUsecase,
  GetSessionsOfBookingUsecase,
  AddTherapySessionUsecase,
  CheckExistSessionInTimeUsecase,
  ValidateTherapySessionUsecase,
  CancelTherapySessionUsecase,
  GetTherapySessionsByTherapistIdUsecase,
  CompleteTherapySessionUsecase,
  CompleteBookingUsecase,
  CreateSessionReportUsecase,
  GetTherapySessionByIdUsecase,
  GetAllSessionReportsUsecase,
  ApproveSessionReportUsecase,
  RejectSessionReportUsecase,
  GetSessionReportsByUserIdUsecase,
  GetTherapistSessionReportsUsecase,
  GetSessionReportByIdUsecase,
  GetTherapistBookingsUsecase,
  GetMemberBookingsUsecase,
  CountMemberBookingsUsecase,
  CountTherapistBookingsUsecase,
  GetTherapySessionByUserIdUsecase,
  RateBookingUsecase,
  CleanupExpiredSessionsUsecase,
];

@Module({
  imports: [
    PersistenceModule,
    TherapyManagementServiceModule,
    ServicePackageManagementServiceModule,
    UserServiceModule,
    TherapistManagementServiceModule,
  ],
  providers: [
    {
      provide: 'IBookingService',
      useClass: BookingService,
    },
    UsecaseHandler,
    ...useCases,
  ],
  exports: [UsecaseHandler, 'IBookingService'],
})
export class BookingServiceModule {}
