import { UseCase } from '../../../usecase.interface';
import { PaymentTransaction } from '../../../../core/domain/entity/payment-transaction.entity';
import { Inject, Injectable } from '@nestjs/common';
import { PaymentTransactionRepository } from '../../../../core/domain/repository/payment-transaction.repository';

@Injectable()
export class AddTransactionHistoryUsecase
  implements UseCase<PaymentTransaction, void>
{
  constructor(
    @Inject('PaymentTransactionRepository')
    private readonly paymentTransactionRepository: PaymentTransactionRepository,
  ) {}

  async execute(paymentTransaction: PaymentTransaction): Promise<void> {
    await this.paymentTransactionRepository.saveTransactionHistory(
      paymentTransaction,
    );
  }
}
