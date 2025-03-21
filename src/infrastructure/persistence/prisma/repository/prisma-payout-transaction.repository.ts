import { Injectable } from '@nestjs/common';
import { PayoutTransactionRepository } from '../../../../core/domain/repository/payout-transaction.repository';
import { PrismaService } from '../prisma.service';
import { PayoutTransaction } from '../../../../core/domain/entity/payout-transaction.entity';
import { PrismaPayoutMapper } from '../mapper/prisma-payout-mapper';
import { TransactionType } from '../../../../core/domain/entity/enum/transaction-type.enum';
import * as console from 'node:console';
import { ProgressStatus } from '@prisma/client';

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

  async getTotalAmount(
    fromDate: Date | undefined,
    toDate: Date | undefined,
  ): Promise<number> {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    );
    const total = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        created_at: {
          gte: fromDate ?? startOfMonth,
          lte: toDate ?? endOfMonth,
        },
        status: ProgressStatus.COMPLETED,
        type: {
          in: [TransactionType.WITHDRAW, TransactionType.REFUND],
        },
      },
    });

    return Number(total._sum.amount ?? 0);
  }
}
