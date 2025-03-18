import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { UsecaseHandler } from '../usecase-handler.service';
import { PayoutService } from './service/payout.service';
import { AddPayoutAccountUseCase } from './service/usecase/add-payout-account.usecase';
import { GetTherapistPayoutAccountsUsecase } from './service/usecase/get-therapist-payout-accounts.usecase';
import { RequestTherapistWithdrawUsecase } from './service/usecase/request-therapist-withdraw.usecase';
import { TherapistManagementServiceModule } from '../therapist-management/therapist-management-service.module';
import { GetWithdrawRequestsByTherapistIdUsecase } from './service/usecase/get-withdraw-requests-by-therapist-id.usecase';
import { GetPayoutAccountByIdUsecase } from './service/usecase/get-payout-account-by-id.usecase';
import { RejectWithdrawRequestUsecase } from './service/usecase/reject-withdraw-request.usecase';
import { ApproveWithdrawRequestUsecase } from './service/usecase/approve-withdraw-request.usecase';
import { GetAllWithdrawRequestsUsecase } from './service/usecase/get-all-withdraw-requests.usecase';
import { CountAllWithdrawRequestsUsecase } from './service/usecase/count-all-withdraw-requests.usecase';
import { CountTherapistWithdrawRequestsUsecase } from './service/usecase/count-therapist-withdraw-requests.usecase';
import { GetPayoutTransactionByReferenceIdUsecase } from './service/usecase/get-payout-transaction-by-reference-id.usecase';
import { CompletePayoutUsecase } from './service/usecase/complete-payout.usecase';
import { GetWithdrawByIdUsecase } from './service/usecase/get-withdraw-by-id.usecase';
import { BookingServiceModule } from '../booking/booking-service.module';
import { CreateRefundRequestUsecase } from './service/usecase/create-refund-request.usecase';
import { GetRefundRequestByReportIdUsecase } from './service/usecase/get-refund-request-by-report-id.usecase';
import { CompleteRefundPayoutUsecase } from './service/usecase/complete-refund-payout.usecase';

const useCases = [
  AddPayoutAccountUseCase,
  GetTherapistPayoutAccountsUsecase,
  RequestTherapistWithdrawUsecase,
  GetWithdrawRequestsByTherapistIdUsecase,
  GetPayoutAccountByIdUsecase,
  RejectWithdrawRequestUsecase,
  ApproveWithdrawRequestUsecase,
  GetAllWithdrawRequestsUsecase,
  CountTherapistWithdrawRequestsUsecase,
  CountAllWithdrawRequestsUsecase,
  GetPayoutTransactionByReferenceIdUsecase,
  CompletePayoutUsecase,
  GetWithdrawByIdUsecase,
  CreateRefundRequestUsecase,
  GetRefundRequestByReportIdUsecase,
  CompleteRefundPayoutUsecase,
];

@Module({
  imports: [
    PersistenceModule,
    TherapistManagementServiceModule,
    BookingServiceModule,
  ],
  providers: [
    {
      provide: 'IPayoutService',
      useClass: PayoutService,
    },
    UsecaseHandler,
    ...useCases,
  ],
  exports: [UsecaseHandler, 'IPayoutService'],
})
export class PayoutServiceModule {}
