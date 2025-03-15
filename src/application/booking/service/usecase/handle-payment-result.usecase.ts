import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { PaymentTransactionRepository } from '../../../../core/domain/repository/payment-transaction.repository';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { CreatePaymentTransactionUsecase } from './create-payment-transaction.usecase';
import { ReferenceTransactionStatusEnum } from '../../../../core/domain/entity/enum/reference-transaction-status.enum';
import { PaymentTransaction } from '../../../../core/domain/entity/payment-transaction.entity';

interface HandlePaymentResultUsecaseCommand {
  paymentGateway: string;
  txnRef: string;
  responseCode: string;
  amount: string;
  currency: string;
  transactionNo: string;
  bankCode?: string;
  payDate: string;
  isSuccessful: boolean;
  message: string;
}

@Injectable()
export class HandlePaymentResultUsecase
  implements UseCase<HandlePaymentResultUsecaseCommand, string>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('PaymentTransactionRepository')
    private readonly paymentTransactionRepository: PaymentTransactionRepository,
  ) {}

  async execute(command: HandlePaymentResultUsecaseCommand): Promise<string> {
    const transaction = await this.getTransactionByReferenceId(command.txnRef);
    const status = command.isSuccessful
      ? ReferenceTransactionStatusEnum.COMPLETED
      : ReferenceTransactionStatusEnum.FAILED;

    console.info('Transaction status:', status);

    await this.usecaseHandler.execute(CreatePaymentTransactionUsecase, {
      bookingId: transaction.booking.id!,
      transactionStatus: status,
      amount: parseFloat(command.amount),
      currency: command.currency,
      returnUrl: transaction.returnUrl,
      changedBy: transaction.changedBy!,
    });

    return transaction.returnUrl!;
  }

  private async getTransactionByReferenceId(
    referenceId: string,
  ): Promise<PaymentTransaction> {
    const transaction =
      await this.paymentTransactionRepository.findTransactionByReferenceId(
        referenceId,
      );

    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  }
}
