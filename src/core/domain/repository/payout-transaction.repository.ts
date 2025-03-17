import { PayoutTransaction } from '../entity/payout-transaction.entity';
import { TransactionType } from '../entity/enum/transaction-type.enum';

export interface PayoutTransactionRepository {
  save(payoutTransaction: PayoutTransaction): Promise<PayoutTransaction>;

  getPayoutTransactionByReferenceId(
    referenceId: string,
    payoutType: TransactionType,
  ): Promise<PayoutTransaction | null>;
}
