import { TransactionType } from '../../../../core/domain/entity/enum/transaction-type.enum';
import { ReferenceTransactionStatusEnum } from '../../../../core/domain/entity/enum/reference-transaction-status.enum';
import { PayoutTransaction } from '../../../../core/domain/entity/payout-transaction.entity';

export class PayoutTransactionInfoDto {
  id: string;
  amount: number;
  currency: string;
  transactionType: TransactionType;
  createdAt: Date;
  updatedAt: Date;
  referenceTransactionId: string;
  transactionStatus?: ReferenceTransactionStatusEnum;
  imageUrl: string;

  constructor(payoutTransaction: PayoutTransaction) {
    this.id = payoutTransaction.id!;
    this.amount = payoutTransaction.amount;
    this.currency = payoutTransaction.currency;
    this.transactionType = payoutTransaction.transactionType;
    this.createdAt = payoutTransaction.createdAt!;
    this.updatedAt = payoutTransaction.updatedAt!;
    this.referenceTransactionId = payoutTransaction.referenceTransactionId;
    this.transactionStatus = payoutTransaction.transactionStatus;
    this.imageUrl = payoutTransaction.imageUrl;
  }
}
