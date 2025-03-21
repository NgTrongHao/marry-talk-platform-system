import { PaymentTransaction } from '../entity/payment-transaction.entity';

export interface PaymentTransactionRepository {
  save(paymentTransaction: PaymentTransaction): Promise<PaymentTransaction>;

  saveTransactionHistory(paymentTransaction: PaymentTransaction): Promise<void>;

  findTransactionByReferenceId(
    referenceId: string,
  ): Promise<PaymentTransaction | null>;

  getTotalAmount(
    fromDate: Date | undefined,
    toDate: Date | undefined,
  ): Promise<number>;
}
