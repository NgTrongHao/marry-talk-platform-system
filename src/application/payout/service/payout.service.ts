import { IPayoutService } from '../payout-service.interface';
import { TherapistPayoutAccountInfoDto } from './dto/therapist-payout-account-info.dto';
import { GetTherapistPayoutAccountsUsecase } from './usecase/get-therapist-payout-accounts.usecase';
import { AddPayoutAccountUseCase } from './usecase/add-payout-account.usecase';
import { UsecaseHandler } from '../../usecase-handler.service';
import { RequestTherapistWithdrawUsecase } from './usecase/request-therapist-withdraw.usecase';
import { Inject, Injectable } from '@nestjs/common';
import { GetWithdrawRequestsByTherapistIdUsecase } from './usecase/get-withdraw-requests-by-therapist-id.usecase';
import { WithdrawRequestInfoDto } from './dto/withdraw-request-info.dto';
import { GetPayoutAccountByIdUsecase } from './usecase/get-payout-account-by-id.usecase';
import { RejectWithdrawRequestUsecase } from './usecase/reject-withdraw-request.usecase';
import { ApproveWithdrawRequestUsecase } from './usecase/approve-withdraw-request.usecase';
import { WithdrawRequest } from '../../../core/domain/entity/withdraw-request.entity';
import { GetAllWithdrawRequestsUsecase } from './usecase/get-all-withdraw-requests.usecase';
import { CountTherapistWithdrawRequestsUsecase } from './usecase/count-therapist-withdraw-requests.usecase';
import { RequestStatus } from '../../../core/domain/entity/enum/request-status.enum';
import { CountAllWithdrawRequestsUsecase } from './usecase/count-all-withdraw-requests.usecase';
import { GetPayoutTransactionByReferenceIdUsecase } from './usecase/get-payout-transaction-by-reference-id.usecase';
import { TransactionType } from '../../../core/domain/entity/enum/transaction-type.enum';
import { PayoutTransaction } from '../../../core/domain/entity/payout-transaction.entity';
import { CompletePayoutUsecase } from './usecase/complete-payout.usecase';
import { ReferenceTransactionStatusEnum } from '../../../core/domain/entity/enum/reference-transaction-status.enum';
import { RefundRequestInfoDto } from './dto/refund-request-info.dto';
import { CreateRefundRequestUsecase } from './usecase/create-refund-request.usecase';
import { IBookingService } from '../../booking/booking-service.interface';
import { CompleteRefundPayoutUsecase } from './usecase/complete-refund-payout.usecase';

@Injectable()
export class PayoutService implements IPayoutService {
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('IBookingService') private readonly bookingService: IBookingService,
  ) {}

  async addPayoutAccount(
    userId: string,
    request: {
      accountNumber: string;
      bankCode: string;
      accountName: string;
    },
  ): Promise<TherapistPayoutAccountInfoDto> {
    return await this.usecaseHandler
      .execute(AddPayoutAccountUseCase, {
        therapistId: userId,
        accountNumber: request.accountNumber,
        bankCode: request.bankCode,
        accountName: request.accountName,
      })
      .then((account) => new TherapistPayoutAccountInfoDto(account));
  }

  async getTherapistPayoutAccounts(
    therapistId: string,
  ): Promise<TherapistPayoutAccountInfoDto[]> {
    return this.usecaseHandler
      .execute(GetTherapistPayoutAccountsUsecase, therapistId)
      .then((payouts) => {
        return payouts.map((payout) => {
          return new TherapistPayoutAccountInfoDto(payout);
        });
      });
  }

  async getTherapistPayoutAccountById(
    payoutAccountId: string,
  ): Promise<TherapistPayoutAccountInfoDto> {
    return await this.usecaseHandler
      .execute(GetPayoutAccountByIdUsecase, payoutAccountId)
      .then((payout) => new TherapistPayoutAccountInfoDto(payout));
  }

  async requestTherapistWithdraw(request: {
    therapistId: string;
    amount: number;
    currency: string;
    payoutAccountId: string;
  }): Promise<WithdrawRequestInfoDto> {
    return this.usecaseHandler
      .execute(RequestTherapistWithdrawUsecase, request)
      .then(
        async (withdraw) =>
          new WithdrawRequestInfoDto(
            withdraw,
            await this.getTherapistPayoutAccountById(withdraw.payoutAccountId),
          ),
      );
  }

  async getWithdrawRequestsByTherapistId(request: {
    page: number;
    limit: number;
    status?: RequestStatus;
    payoutAccountId?: string;
    therapistId: string;
  }): Promise<{
    requests: WithdrawRequestInfoDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }> {
    const requests = await this.usecaseHandler
      .execute(GetWithdrawRequestsByTherapistIdUsecase, request)
      .then(
        async (withdraws) =>
          await Promise.all(
            withdraws.map(async (withdraw) => {
              return new WithdrawRequestInfoDto(
                withdraw,
                await this.getTherapistPayoutAccountById(
                  withdraw.payoutAccountId,
                ),
                (await this.usecaseHandler.execute(
                  GetPayoutTransactionByReferenceIdUsecase,
                  {
                    referenceId: withdraw.id!,
                    payoutType: TransactionType.WITHDRAW,
                  },
                )) as PayoutTransaction | undefined,
              );
            }),
          ),
      );

    const total = await this.usecaseHandler.execute(
      CountTherapistWithdrawRequestsUsecase,
      request,
    );

    return {
      requests,
      page: request.page,
      limit: request.limit,
      total: total,
      totalPages: Math.ceil(total / request.limit),
    };
  }

  async reviewWithdrawRequest(
    withdrawRequestId: string,
    approve: boolean,
  ): Promise<WithdrawRequestInfoDto> {
    let withdraw: WithdrawRequest;
    if (approve) {
      withdraw = await this.usecaseHandler.execute(
        ApproveWithdrawRequestUsecase,
        withdrawRequestId,
      );
    } else {
      withdraw = await this.usecaseHandler.execute(
        RejectWithdrawRequestUsecase,
        withdrawRequestId,
      );
    }
    return new WithdrawRequestInfoDto(
      withdraw,
      await this.getTherapistPayoutAccountById(withdraw.payoutAccountId),
      (await this.usecaseHandler.execute(
        GetPayoutTransactionByReferenceIdUsecase,
        {
          referenceId: withdraw.id!,
          payoutType: TransactionType.WITHDRAW,
        },
      )) as PayoutTransaction | undefined,
    );
  }

  async getAllWithdrawRequests(request: {
    page: number;
    limit: number;
    status?: string;
  }): Promise<{
    requests: WithdrawRequestInfoDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }> {
    const requests = await this.usecaseHandler
      .execute(GetAllWithdrawRequestsUsecase, request)
      .then(
        async (withdraws) =>
          await Promise.all(
            withdraws.map(async (withdraw) => {
              return new WithdrawRequestInfoDto(
                withdraw,
                await this.getTherapistPayoutAccountById(
                  withdraw.payoutAccountId,
                ),
                (await this.usecaseHandler.execute(
                  GetPayoutTransactionByReferenceIdUsecase,
                  {
                    referenceId: withdraw.id!,
                    payoutType: TransactionType.WITHDRAW,
                  },
                )) as PayoutTransaction | undefined,
              );
            }),
          ),
      );

    const total = await this.usecaseHandler.execute(
      CountAllWithdrawRequestsUsecase,
      request.status,
    );

    return {
      requests,
      page: request.page,
      limit: request.limit,
      total: total,
      totalPages: Math.ceil(total / request.limit),
    };
  }

  async completeWithdrawRequest(request: {
    transactionType: TransactionType;
    payoutId: string;
    amount: number;
    currency: string;
    referenceTransactionId: string;
    imageUrl: string;
  }): Promise<WithdrawRequestInfoDto> {
    return await this.usecaseHandler
      .execute(CompletePayoutUsecase, {
        transactionType: request.transactionType,
        payoutId: request.payoutId,
        amount: request.amount,
        currency: request.currency,
        transactionId: request.referenceTransactionId,
        transactionStatus: ReferenceTransactionStatusEnum.COMPLETED,
        imageUrl: request.imageUrl,
      })
      .then(async (withdraw) => {
        return new WithdrawRequestInfoDto(
          withdraw,
          await this.getTherapistPayoutAccountById(withdraw.payoutAccountId),
          (await this.usecaseHandler.execute(
            GetPayoutTransactionByReferenceIdUsecase,
            {
              referenceId: withdraw.id!,
              payoutType: TransactionType.WITHDRAW,
            },
          )) as PayoutTransaction | undefined,
        );
      });
  }

  async createRefundRequest(request: {
    userId: string;
    reportId: string;
    accountNumber: string;
    bankCode: string;
  }): Promise<RefundRequestInfoDto> {
    return this.usecaseHandler
      .execute(CreateRefundRequestUsecase, request)
      .then(async (refund) => {
        return new RefundRequestInfoDto(
          refund,
          await this.bookingService.getSessionReportById(refund.reportId),
        );
      });
  }

  async completeRefundRequest(
    refundId: string,
    request: {
      transactionType: TransactionType;
      amount: number;
      currency: string;
      referenceTransactionId: string;
      imageUrl: string;
    },
  ): Promise<RefundRequestInfoDto> {
    return this.usecaseHandler
      .execute(CompleteRefundPayoutUsecase, {
        refundRequestId: refundId,
        transactionId: request.referenceTransactionId,
        amount: request.amount,
        currency: request.currency,
        transactionType: request.transactionType,
        transactionStatus: ReferenceTransactionStatusEnum.COMPLETED,
        imageUrl: request.imageUrl,
      })
      .then(async (refund) => {
        return new RefundRequestInfoDto(
          refund,
          await this.bookingService.getSessionReportById(refund.reportId),
        );
      });
  }
}
