import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { PaymentTransactionRepository } from '../../../../core/domain/repository/payment-transaction.repository';
import { PayoutTransactionRepository } from '../../../../core/domain/repository/payout-transaction.repository';

interface GetFinancialReportUsecaseCommand {
  fromDate: Date | undefined;
  toDate: Date | undefined;
}

@Injectable()
export class GetFinancialReportUsecase
  implements
    UseCase<
      GetFinancialReportUsecaseCommand,
      {
        revenue: number;
        expense: number;
        profit: number;
      }
    >
{
  constructor(
    @Inject('PaymentTransactionRepository')
    private readonly paymentTransactionRepository: PaymentTransactionRepository,
    @Inject('PayoutTransactionRepository')
    private payoutTransactionRepository: PayoutTransactionRepository,
  ) {}

  async execute(command: GetFinancialReportUsecaseCommand): Promise<{
    revenue: number;
    expense: number;
    profit: number;
  }> {
    const revenue = await this.paymentTransactionRepository.getTotalAmount(
      command.fromDate,
      command.toDate,
    );
    const expense = await this.payoutTransactionRepository.getTotalAmount(
      command.fromDate,
      command.toDate,
    );

    return {
      revenue,
      expense,
      profit: revenue - expense,
    };
  }
}
