import { Transaction } from '@prisma/client';
import { PayoutTransaction } from '../../../../core/domain/entity/payout-transaction.entity';
import { TransactionType } from '../../../../core/domain/entity/enum/transaction-type.enum';
import { ReferenceTransactionStatusEnum } from '../../../../core/domain/entity/enum/reference-transaction-status.enum';

export class PrismaPayoutMapper {
  static toDomain(entity: Transaction): PayoutTransaction {
    return PayoutTransaction.build({
      id: entity.transaction_id,
      amount: entity.amount.toNumber(),
      currency: entity.currency,
      requestId:
        entity.reference_withdraw_id || entity.reference_refund_id || '',
      referenceTransactionId: entity.reference_transaction_id,
      transactionType: entity.type as TransactionType,
      transactionStatus: entity.status as ReferenceTransactionStatusEnum,
      imageUrl: entity.return_url!,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
      changedBy: entity.changed_by || undefined,
    });
  }
}
