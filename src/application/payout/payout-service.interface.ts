import { TherapistPayoutAccountInfoDto } from './service/dto/therapist-payout-account-info.dto';
import { WithdrawRequestInfoDto } from './service/dto/withdraw-request-info.dto';
import { TransactionType } from '../../core/domain/entity/enum/transaction-type.enum';

export interface IPayoutService {
  addPayoutAccount(
    userId: string,
    request: {
      accountNumber: string;
      bankCode: string;
      accountName: string;
    },
  ): Promise<TherapistPayoutAccountInfoDto>;

  getTherapistPayoutAccounts(
    therapistId: string,
  ): Promise<TherapistPayoutAccountInfoDto[]>;

  requestTherapistWithdraw(request: {
    therapistId: string;
    amount: number;
    currency: string;
    payoutAccountId: string;
  }): Promise<WithdrawRequestInfoDto>;

  getWithdrawRequestsByTherapistId(request: {
    page: number;
    limit: number;
    status?: string;
    payoutAccountId?: string;
    therapistId: string;
  }): Promise<{
    requests: WithdrawRequestInfoDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>;

  reviewWithdrawRequest(
    withdrawRequestId: string,
    approve: boolean,
  ): Promise<WithdrawRequestInfoDto>;

  getAllWithdrawRequests(param: {
    page: number;
    limit: number;
    status: string | undefined;
  }): Promise<{
    requests: WithdrawRequestInfoDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>;

  completeWithdrawRequest(request: {
    transactionType: TransactionType;
    payoutId: string;
    amount: number;
    currency: string;
    referenceTransactionId: string;
    imageUrl: string;
  }): Promise<WithdrawRequestInfoDto>;
}
