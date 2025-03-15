// import { UseCase } from '../../../usecase.interface';
// import { ReferenceTransactionStatusEnum } from '../../../../core/domain/entity/enum/reference-transaction-status.enum';
// import { PaymentTransaction } from '../../../../core/domain/entity/payment-transaction.entity';
// import { Inject, Injectable, NotFoundException } from '@nestjs/common';
// import { BookingRepository } from '../../../../core/domain/repository/booking.repository';
// import { PaymentTransactionRepository } from '../../../../core/domain/repository/payment-transaction.repository';
// import { UsecaseHandler } from '../../../usecase-handler.service';
// import { TransactionType } from '../../../../core/domain/entity/enum/transaction-type.enum';
// import { Booking } from '../../../../core/domain/entity/booking.entity';
// import { AddTransactionHistoryUsecase } from './add-transaction-history.usecase';
//
// export interface CreatePaymentTransactionUsecaseCommand {
//   bookingId: string;
//   amount: number;
//   currency: string;
//   transactionStatus: ReferenceTransactionStatusEnum;
//   returnUrl?: string;
//   changedBy: string;
// }
//
// @Injectable()
// export class CreatePaymentTransactionUsecase
//   implements UseCase<CreatePaymentTransactionUsecaseCommand, PaymentTransaction>
// {
//   constructor(
//     private usecaseHandler: UsecaseHandler,
//     @Inject('BookingRepository')
//     private readonly bookingRepository: BookingRepository,
//     @Inject('PaymentTransactionRepository')
//     private readonly paymentTransactionRepository: PaymentTransactionRepository,
//   ) {}
//
//   async execute(
//     command: CreatePaymentTransactionUsecaseCommand,
//   ): Promise<PaymentTransaction> {
//     const booking = await this.getBooking(command.bookingId);
//
//     switch (command.transactionStatus) {
//       case ReferenceTransactionStatusEnum.PENDING: {
//         if (command.returnUrl === undefined) {
//           throw new Error('Return URL is required');
//         }
//
//         const transaction =
//           await this.paymentTransactionRepository.findTransactionByReferenceId(
//             command.bookingId,
//           );
//
//         return this.pendingTransaction(
//           booking,
//           command.amount,
//           command.currency,
//           command.returnUrl,
//           command.changedBy,
//           transaction != null ? transaction : undefined,
//         );
//       }
//       case ReferenceTransactionStatusEnum.COMPLETED: {
//         const transaction =
//           await this.paymentTransactionRepository.findTransactionByReferenceId(
//             command.bookingId,
//           );
//
//         if (!transaction) {
//           throw new NotFoundException('Transaction not found');
//         }
//
//         return this.successTransaction(
//           transaction,
//           booking,
//           command.amount,
//           command.currency,
//           command.changedBy,
//         );
//       }
//       case ReferenceTransactionStatusEnum.FAILED: {
//         const transaction =
//           await this.paymentTransactionRepository.findTransactionByReferenceId(
//             command.bookingId,
//           );
//
//         if (!transaction) {
//           throw new NotFoundException('Transaction not found');
//         }
//
//         return this.failedTransaction(
//           transaction,
//           booking,
//           command.amount,
//           command.currency,
//           command.changedBy,
//         );
//       }
//       case ReferenceTransactionStatusEnum.CANCELLED: {
//         throw new Error('Transaction cancelled');
//       }
//       default: {
//         throw new NotFoundException('Transaction status not found');
//       }
//     }
//   }
//
//   private async getBooking(bookingId: string) {
//     const booking = await this.bookingRepository.findBookingById(bookingId);
//     if (!booking) {
//       throw new NotFoundException('Booking not found');
//     }
//     return booking;
//   }
//
//   private async pendingTransaction(
//     booking: Booking,
//     amount: number,
//     currency: string,
//     returnUrl: string,
//     changedBy: string,
//     transaction?: PaymentTransaction,
//   ) {
//     const paymentTransaction = PaymentTransaction.create({
//       id: transaction?.id,
//       booking,
//       amount,
//       currency,
//       transactionStatus: ReferenceTransactionStatusEnum.PENDING,
//       transactionType: TransactionType.PAYMENT,
//       returnUrl,
//       referenceTransactionId: booking.id!,
//       changedBy: changedBy,
//     });
//
//     const savedTransaction =
//       await this.paymentTransactionRepository.save(paymentTransaction);
//
//     console.info('Transaction created', transaction);
//
//     await this.saveTransactionHistory(paymentTransaction);
//
//     console.info('Transaction history created', transaction);
//
//     return savedTransaction;
//   }
//
//   private async successTransaction(
//     transaction: PaymentTransaction,
//     booking: Booking,
//     amount: number,
//     currency: string,
//     changedBy: string,
//   ) {
//     const paymentTransaction = PaymentTransaction.build({
//       id: transaction.id,
//       booking,
//       amount,
//       currency,
//       transactionStatus: ReferenceTransactionStatusEnum.COMPLETED,
//       transactionType: TransactionType.PAYMENT,
//       changedBy: changedBy,
//       referenceTransactionId: booking.id!,
//     });
//
//     const savedTransaction =
//       await this.paymentTransactionRepository.save(paymentTransaction);
//
//     await this.saveTransactionHistory(paymentTransaction);
//
//     console.info('Transaction history created', transaction);
//
//     return savedTransaction;
//   }
//
//   private async failedTransaction(
//     transaction: PaymentTransaction,
//     booking: Booking,
//     amount: number,
//     currency: string,
//     changedBy: string,
//   ) {
//     const paymentTransaction = PaymentTransaction.build({
//       id: transaction.id,
//       booking,
//       amount,
//       currency,
//       transactionStatus: ReferenceTransactionStatusEnum.FAILED,
//       transactionType: TransactionType.PAYMENT,
//       referenceTransactionId: booking.id!,
//       changedBy: changedBy,
//     });
//
//     const savedTransaction =
//       await this.paymentTransactionRepository.save(paymentTransaction);
//
//     await this.saveTransactionHistory(paymentTransaction);
//
//     console.info('Transaction history created', transaction);
//
//     return savedTransaction;
//   }
//
//   private async saveTransactionHistory(transaction: PaymentTransaction) {
//     await this.usecaseHandler.execute(
//       AddTransactionHistoryUsecase,
//       transaction,
//     );
//   }
// }

import { UseCase } from '../../../usecase.interface';
import { ReferenceTransactionStatusEnum } from '../../../../core/domain/entity/enum/reference-transaction-status.enum';
import { PaymentTransaction } from '../../../../core/domain/entity/payment-transaction.entity';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';
import { PaymentTransactionRepository } from '../../../../core/domain/repository/payment-transaction.repository';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { TransactionType } from '../../../../core/domain/entity/enum/transaction-type.enum';
import { Booking } from '../../../../core/domain/entity/booking.entity';
import { AddTransactionHistoryUsecase } from './add-transaction-history.usecase';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';

export interface CreatePaymentTransactionUsecaseCommand {
  bookingId: string;
  amount: number;
  currency: string;
  transactionStatus: ReferenceTransactionStatusEnum;
  returnUrl?: string;
  changedBy: string;
}

@Injectable()
export class CreatePaymentTransactionUsecase
  implements UseCase<CreatePaymentTransactionUsecaseCommand, PaymentTransaction>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('BookingRepository')
    private readonly bookingRepository: BookingRepository,
    @Inject('PaymentTransactionRepository')
    private readonly paymentTransactionRepository: PaymentTransactionRepository,
  ) {}

  async execute(
    command: CreatePaymentTransactionUsecaseCommand,
  ): Promise<PaymentTransaction> {
    const booking = await this.getBooking(command.bookingId);

    const transaction =
      await this.paymentTransactionRepository.findTransactionByReferenceId(
        command.bookingId,
      );

    switch (command.transactionStatus) {
      case ReferenceTransactionStatusEnum.PENDING: {
        if (!command.returnUrl) {
          throw new BadRequestException('Return URL is required');
        }
        if (!command.changedBy) {
          throw new BadRequestException(
            'Changed by is required for transaction',
          );
        }
        return this.pendingTransaction(
          booking,
          command,
          transaction ?? undefined,
        );
      }
      case ReferenceTransactionStatusEnum.COMPLETED: {
        if (!transaction) {
          throw new NotFoundException('Transaction not found');
        }
        return this.successTransaction(transaction, booking, command);
      }
      case ReferenceTransactionStatusEnum.FAILED: {
        if (!transaction) {
          throw new NotFoundException('Transaction not found');
        }
        return this.failedTransaction(transaction, booking, command);
      }
      case ReferenceTransactionStatusEnum.CANCELLED: {
        throw new BadRequestException('Transaction has been cancelled');
      }
      default: {
        throw new NotFoundException('Invalid transaction status');
      }
    }
  }

  private async getBooking(bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findBookingById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  private async pendingTransaction(
    booking: Booking,
    command: CreatePaymentTransactionUsecaseCommand,
    transaction?: PaymentTransaction,
  ) {
    const paymentTransaction = PaymentTransaction.create({
      id: transaction?.id,
      booking,
      amount: command.amount,
      currency: command.currency,
      transactionStatus: ReferenceTransactionStatusEnum.PENDING,
      transactionType: TransactionType.PAYMENT,
      returnUrl: command.returnUrl,
      referenceTransactionId: booking.id!,
      changedBy: command.changedBy,
    });

    const savedTransaction =
      await this.paymentTransactionRepository.save(paymentTransaction);

    await this.saveTransactionHistory(savedTransaction);
    return savedTransaction;
  }

  private async successTransaction(
    transaction: PaymentTransaction,
    booking: Booking,
    command: CreatePaymentTransactionUsecaseCommand,
  ) {
    const paymentTransaction = PaymentTransaction.build({
      id: transaction.id,
      booking,
      amount: command.amount,
      currency: command.currency,
      transactionStatus: ReferenceTransactionStatusEnum.COMPLETED,
      transactionType: TransactionType.PAYMENT,
      changedBy: command.changedBy,
      referenceTransactionId: booking.id!,
    });

    const savedTransaction =
      await this.paymentTransactionRepository.save(paymentTransaction);

    await this.saveTransactionHistory(savedTransaction);

    await this.updateBookingStatus(booking, ProgressStatus.COMPLETED);

    return savedTransaction;
  }

  private async failedTransaction(
    transaction: PaymentTransaction,
    booking: Booking,
    command: CreatePaymentTransactionUsecaseCommand,
  ) {
    const paymentTransaction = PaymentTransaction.build({
      id: transaction.id,
      booking,
      amount: command.amount,
      currency: command.currency,
      transactionStatus: ReferenceTransactionStatusEnum.FAILED,
      transactionType: TransactionType.PAYMENT,
      referenceTransactionId: booking.id!,
      changedBy: command.changedBy,
    });

    const savedTransaction =
      await this.paymentTransactionRepository.save(paymentTransaction);

    await this.saveTransactionHistory(savedTransaction);

    await this.updateBookingStatus(booking, ProgressStatus.CANCELLED);

    return savedTransaction;
  }

  private async saveTransactionHistory(transaction: PaymentTransaction) {
    await this.usecaseHandler.execute(
      AddTransactionHistoryUsecase,
      transaction,
    );
  }

  private async updateBookingStatus(booking: Booking, status: ProgressStatus) {
    booking = Booking.changeStatus(booking, status);
    await this.bookingRepository.save(booking);
  }
}
