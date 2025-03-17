import { Injectable } from '@nestjs/common';
import { PayoutTransactionRepository } from '../../../../core/domain/repository/payout-transaction.repository';
import { PrismaService } from '../prisma.service';
import { PayoutTransaction } from '../../../../core/domain/entity/payout-transaction.entity';
import { PrismaPayoutMapper } from '../mapper/prisma-payout-mapper';
import { TransactionType } from '../../../../core/domain/entity/enum/transaction-type.enum';

@Injectable()
export class PrismaPayoutTransactionRepository
  implements PayoutTransactionRepository
{
  constructor(private prisma: PrismaService) {}

  async save(payoutTransaction: PayoutTransaction): Promise<PayoutTransaction> {
    console.info('payoutTransaction', payoutTransaction);
    return this.prisma.transaction
      .upsert({
        where: {
          reference_transaction_id: payoutTransaction.referenceTransactionId,
        },
        update: {
          amount: payoutTransaction.amount,
          currency: payoutTransaction.currency,
          type: payoutTransaction.transactionType,
          status: payoutTransaction.transactionStatus,
          return_url: payoutTransaction.imageUrl,
          withdrawRequest:
            payoutTransaction.transactionType === TransactionType.WITHDRAW
              ? {
                  connect: {
                    request_id: payoutTransaction.requestId,
                  },
                }
              : undefined,
          refundRequest:
            payoutTransaction.transactionType === TransactionType.REFUND
              ? {
                  connect: {
                    request_id: payoutTransaction.requestId,
                  },
                }
              : undefined,
        },
        create: {
          reference_transaction_id: payoutTransaction.referenceTransactionId,
          amount: payoutTransaction.amount,
          currency: payoutTransaction.currency,
          type: payoutTransaction.transactionType,
          status: payoutTransaction.transactionStatus,
          return_url: payoutTransaction.imageUrl,
          withdrawRequest:
            payoutTransaction.transactionType === TransactionType.WITHDRAW
              ? {
                  connect: {
                    request_id: payoutTransaction.requestId,
                  },
                }
              : undefined,
          refundRequest:
            payoutTransaction.transactionType === TransactionType.REFUND
              ? {
                  connect: {
                    request_id: payoutTransaction.requestId,
                  },
                }
              : undefined,
        },
      })
      .then((transaction) => PrismaPayoutMapper.toDomain(transaction));
  }

  async getPayoutTransactionByReferenceId(
    referenceId: string,
    payoutType: TransactionType,
  ): Promise<PayoutTransaction | null> {
    if (payoutType === TransactionType.REFUND) {
      return this.prisma.transaction
        .findUnique({
          where: {
            reference_refund_id: referenceId,
            type: TransactionType.REFUND,
          },
        })
        .then((transaction) =>
          transaction ? PrismaPayoutMapper.toDomain(transaction) : null,
        );
    } else {
      return this.prisma.transaction
        .findUnique({
          where: {
            reference_withdraw_id: referenceId,
            type: TransactionType.WITHDRAW,
          },
        })
        .then((transaction) =>
          transaction ? PrismaPayoutMapper.toDomain(transaction) : null,
        );
    }
  }
}
