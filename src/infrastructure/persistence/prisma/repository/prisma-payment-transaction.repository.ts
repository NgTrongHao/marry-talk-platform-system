import { PaymentTransactionRepository } from '../../../../core/domain/repository/payment-transaction.repository';
import { PrismaService } from '../prisma.service';
import { PaymentTransaction } from '../../../../core/domain/entity/payment-transaction.entity';
import { PrismaPaymentTransactionMapper } from '../mapper/prisma-payment-transaction-mapper';
import { Injectable } from '@nestjs/common';
import {
  ProgressStatus,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import * as console from 'node:console';

@Injectable()
export class PrismaPaymentTransactionRepository
  implements PaymentTransactionRepository
{
  constructor(private prisma: PrismaService) {}

  async save(
    paymentTransaction: PaymentTransaction,
  ): Promise<PaymentTransaction> {
    return this.prisma.transaction
      .upsert({
        where: {
          transaction_id: paymentTransaction.id!,
        },
        update: {
          amount: paymentTransaction.amount,
          currency: paymentTransaction.currency,
          status: paymentTransaction.transactionStatus,
          reference_payment_id: paymentTransaction.booking.id!,
          type: paymentTransaction.transactionType,
          return_url: paymentTransaction.returnUrl!,
          reference_transaction_id: paymentTransaction.referenceTransactionId,
          changed_by: paymentTransaction.changedBy,
        },
        create: {
          transaction_id: paymentTransaction.id,
          amount: paymentTransaction.amount,
          currency: paymentTransaction.currency,
          reference_payment_id: paymentTransaction.booking.id!,
          type: paymentTransaction.transactionType,
          return_url: paymentTransaction.returnUrl!,
          reference_transaction_id: paymentTransaction.referenceTransactionId,
          changed_by: paymentTransaction.changedBy,
        },
        include: {
          payment: {
            include: {
              therapistService: {
                include: {
                  package: true,
                },
              },
            },
          },
        },
      })
      .then((result) => {
        return PrismaPaymentTransactionMapper.toDomain(result);
      });
  }

  // async saveTransactionHistory(
  //   paymentTransaction: PaymentTransaction,
  // ): Promise<any> {
  //   const transactionHistory = await this.prisma.transactionHistory.findFirst({
  //     where: {
  //       transaction_id: paymentTransaction.id!,
  //     },
  //     orderBy: {
  //       created_at: 'desc',
  //     },
  //   });
  //   console.info('Transaction history found', transactionHistory);
  //   const savedTransactionHistory = await this.prisma.transactionHistory.create(
  //     {
  //       data: {
  //         transaction: {
  //           connect: { transaction_id: paymentTransaction.id! },
  //         },
  //         amount: paymentTransaction.amount,
  //         currency: paymentTransaction.currency,
  //         type: paymentTransaction.transactionType,
  //         user: {
  //           connect: {
  //             user_id: transactionHistory
  //               ? transactionHistory.changed_by
  //               : paymentTransaction.changedBy!,
  //           },
  //         },
  //         new_status: paymentTransaction.transactionStatus as TransactionStatus,
  //         old_status: transactionHistory?.new_status as TransactionStatus,
  //       },
  //     },
  //   );
  //   console.info('Transaction history created', savedTransactionHistory);
  // }

  async saveTransactionHistory(paymentTransaction: PaymentTransaction) {
    const lastTransactionHistory =
      await this.prisma.transactionHistory.findFirst({
        where: { transaction_id: paymentTransaction.id! },
        orderBy: { created_at: 'desc' },
      });

    console.info('Transaction history found', lastTransactionHistory);

    const savedTransactionHistory = await this.prisma.transactionHistory.create(
      {
        data: {
          transaction: { connect: { transaction_id: paymentTransaction.id! } },
          amount: paymentTransaction.amount,
          currency: paymentTransaction.currency,
          type: paymentTransaction.transactionType,
          user: {
            connect: {
              user_id: lastTransactionHistory
                ? lastTransactionHistory.changed_by
                : paymentTransaction.changedBy!,
            },
          },
          new_status: paymentTransaction.transactionStatus as TransactionStatus,
          old_status: lastTransactionHistory?.new_status as TransactionStatus,
        },
      },
    );

    console.info('Transaction history created', savedTransactionHistory);
  }

  async findTransactionByReferenceId(
    referenceId: string,
  ): Promise<PaymentTransaction | null> {
    const result = await this.prisma.transaction.findUnique({
      where: {
        reference_transaction_id: referenceId,
      },
      include: {
        payment: {
          include: {
            therapistService: {
              include: {
                package: true,
              },
            },
          },
        },
      },
    });
    if (result) {
      return PrismaPaymentTransactionMapper.toDomain(result);
    }
    return null;
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
    console.info('Start of month', startOfMonth);
    console.info('End of month', endOfMonth);
    const total = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        created_at: {
          gte: fromDate ?? startOfMonth,
          lte: toDate ?? endOfMonth,
        },
        status: ProgressStatus.COMPLETED,
        type: TransactionType.PAYMENT,
      },
    });

    return Number(total._sum.amount ?? 0);
  }
}
