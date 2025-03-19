import { ReferenceTransactionStatusEnum } from '../../../../core/domain/entity/enum/reference-transaction-status.enum';
import { TransactionType } from '../../../../core/domain/entity/enum/transaction-type.enum';
import { UseCase } from '../../../usecase.interface';
import { RefundRequest } from '../../../../core/domain/entity/refund-request.entity';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PayoutTransactionRepository } from '../../../../core/domain/repository/payout-transaction.repository';
import { RefundRequestRepository } from '../../../../core/domain/repository/refund-request.repository';
import { RequestStatus } from '../../../../core/domain/entity/enum/request-status.enum';
import { PayoutTransaction } from '../../../../core/domain/entity/payout-transaction.entity';

interface CompleteRefundPayoutUsecaseCommand {
  refundRequestId: string;
  amount: number;
  currency: string;
  transactionId: string;
  transactionStatus: ReferenceTransactionStatusEnum;
  imageUrl: string;
  transactionType: TransactionType;
}

@Injectable()
export class CompleteRefundPayoutUsecase
  implements UseCase<CompleteRefundPayoutUsecaseCommand, RefundRequest>
{
  constructor(
    @Inject('PayoutTransactionRepository')
    private payoutTransactionRepository: PayoutTransactionRepository,
    @Inject('RefundRequestRepository')
    private refundRequestRepository: RefundRequestRepository,
  ) {}

  async execute(
    command: CompleteRefundPayoutUsecaseCommand,
  ): Promise<RefundRequest> {
    const refundRequest =
      await this.refundRequestRepository.getRefundRequestById(
        command.refundRequestId,
      );

    if (!refundRequest) {
      throw new NotFoundException('Refund request not found');
    }

    if (refundRequest.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Refund request is not pending');
    }

    refundRequest.status = RequestStatus.COMPLETED;

    const payoutTransaction = PayoutTransaction.create({
      requestId: command.refundRequestId,
      amount: command.amount,
      currency: command.currency,
      referenceTransactionId: command.transactionId,
      transactionType: command.transactionType,
      transactionStatus: ReferenceTransactionStatusEnum.COMPLETED,
      imageUrl: command.imageUrl,
    });

    await this.payoutTransactionRepository.save(payoutTransaction);

    return this.refundRequestRepository.save(refundRequest);
  }
}
