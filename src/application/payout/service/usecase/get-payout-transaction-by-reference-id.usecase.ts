import { TransactionType } from '../../../../core/domain/entity/enum/transaction-type.enum';
import { UseCase } from '../../../usecase.interface';
import { PayoutTransaction } from '../../../../core/domain/entity/payout-transaction.entity';
import { Inject, Injectable } from '@nestjs/common';
import { PayoutTransactionRepository } from '../../../../core/domain/repository/payout-transaction.repository';

interface GetPayoutTransactionByReferenceIdUsecaseCommand {
  referenceId: string;
  payoutType: TransactionType;
}

@Injectable()
export class GetPayoutTransactionByReferenceIdUsecase
  implements
    UseCase<
      GetPayoutTransactionByReferenceIdUsecaseCommand,
      PayoutTransaction | null
    >
{
  constructor(
    @Inject('PayoutTransactionRepository')
    private payoutTransactionRepository: PayoutTransactionRepository,
  ) {}

  async execute(
    command: GetPayoutTransactionByReferenceIdUsecaseCommand,
  ): Promise<PayoutTransaction | null> {
    const transaction =
      await this.payoutTransactionRepository.getPayoutTransactionByReferenceId(
        command.referenceId,
        command.payoutType,
      );
    console.info('transaction', transaction);

    return transaction;
  }
}
