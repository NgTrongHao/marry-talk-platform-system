import { WithdrawRequest } from '../../../../core/domain/entity/withdraw-request.entity';
import { TherapistPayoutAccountInfoDto } from './therapist-payout-account-info.dto';
import { PayoutTransactionInfoDto } from './payout-transaction-info.dto';
import { PayoutTransaction } from '../../../../core/domain/entity/payout-transaction.entity';

export class WithdrawRequestInfoDto {
  id: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  payoutAccount: TherapistPayoutAccountInfoDto;
  therapistId: string;
  transaction?: PayoutTransactionInfoDto;

  constructor(
    withdrawRequest: WithdrawRequest,
    payoutAccount: TherapistPayoutAccountInfoDto,
    payoutTransaction?: PayoutTransaction,
  ) {
    this.id = withdrawRequest.id!;
    this.amount = withdrawRequest.amount;
    this.status = withdrawRequest.status!;
    this.createdAt = withdrawRequest.createdAt!;
    this.updatedAt = withdrawRequest.updatedAt!;
    this.payoutAccount = payoutAccount;
    this.therapistId = withdrawRequest.therapistId;
    if (payoutTransaction) {
      this.transaction = new PayoutTransactionInfoDto(payoutTransaction);
    }
  }
}
