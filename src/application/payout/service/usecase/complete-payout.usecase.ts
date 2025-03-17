import { UseCase } from '../../../usecase.interface';
import { ReferenceTransactionStatusEnum } from '../../../../core/domain/entity/enum/reference-transaction-status.enum';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PayoutTransactionRepository } from '../../../../core/domain/repository/payout-transaction.repository';
import { PayoutTransaction } from '../../../../core/domain/entity/payout-transaction.entity';
import { WithdrawRequestRepository } from '../../../../core/domain/repository/withdraw-request.repository';
import { RequestStatus } from '../../../../core/domain/entity/enum/request-status.enum';
import { TransactionType } from '../../../../core/domain/entity/enum/transaction-type.enum';
import { WithdrawRequest } from '../../../../core/domain/entity/withdraw-request.entity';

interface CompletePayoutUsecaseCommand {
  payoutId: string;
  amount: number;
  currency: string;
  transactionId: string;
  transactionStatus: ReferenceTransactionStatusEnum;
  imageUrl: string;
  transactionType: TransactionType;
}

@Injectable()
export class CompletePayoutUsecase
  implements UseCase<CompletePayoutUsecaseCommand, WithdrawRequest>
{
  constructor(
    @Inject('PayoutTransactionRepository')
    private payoutTransactionRepository: PayoutTransactionRepository,
    @Inject('WithdrawRequestRepository')
    private withdrawRequestRepository: WithdrawRequestRepository,
  ) {}

  async execute(
    command: CompletePayoutUsecaseCommand,
  ): Promise<WithdrawRequest> {
    const withdrawRequest =
      await this.withdrawRequestRepository.getWithdrawRequestById(
        command.payoutId,
      );

    if (!withdrawRequest) {
      throw new NotFoundException('Withdraw request not found');
    }

    switch (withdrawRequest.status) {
      case RequestStatus.PENDING:
        throw new BadRequestException(
          'Withdraw request is still pending. Need to approve first',
        );
      case RequestStatus.APPROVED:
        break;
      case RequestStatus.COMPLETED:
        throw new BadRequestException('Withdraw request is already completed');
      case RequestStatus.REJECTED:
        throw new BadRequestException('Withdraw request is already rejected');
      default:
        throw new BadRequestException('Invalid request status');
    }

    const payoutTransaction = PayoutTransaction.create({
      requestId: command.payoutId,
      amount: command.amount,
      currency: command.currency,
      referenceTransactionId: command.transactionId,
      transactionType: command.transactionType,
      transactionStatus: ReferenceTransactionStatusEnum.COMPLETED,
      imageUrl: command.imageUrl,
    });

    await this.payoutTransactionRepository.save(payoutTransaction);

    withdrawRequest.status = RequestStatus.COMPLETED;

    return await this.withdrawRequestRepository.save(withdrawRequest);
  }
}
