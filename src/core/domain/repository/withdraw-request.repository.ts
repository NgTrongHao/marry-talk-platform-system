import { WithdrawRequest } from '../entity/withdraw-request.entity';
import { TherapistBalance } from '../entity/therapist-balance.entity';

export interface WithdrawRequestRepository {
  save(withdrawRequest: WithdrawRequest): Promise<WithdrawRequest>;

  updateTherapistBalance(
    therapistId: string,
    balance: number,
  ): Promise<TherapistBalance>;

  getWithdrawRequestsByTherapistId(
    therapistId: string,
    page: number,
    limit: number,
    status: string | undefined,
    payoutAccountId: string | undefined,
  ): Promise<WithdrawRequest[]>;

  getWithdrawRequestById(
    withdrawRequestId: string,
  ): Promise<WithdrawRequest | null>;

  getAllWithdrawRequests(
    page: number,
    limit: number,
    status: string | undefined,
  ): Promise<WithdrawRequest[]>;

  countWithdrawRequestsByTherapistId(
    therapistId: string,
    status: string | undefined,
    payoutAccountId: string | undefined,
  ): Promise<number>;

  countAllWithdrawRequests(status: string | undefined): Promise<number>;

  getLastWithdrawRequest(therapistId: string): Promise<WithdrawRequest | null>;
}
