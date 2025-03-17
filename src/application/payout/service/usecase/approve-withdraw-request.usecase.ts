import { UseCase } from '../../../usecase.interface';
import { WithdrawRequest } from '../../../../core/domain/entity/withdraw-request.entity';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WithdrawRequestRepository } from '../../../../core/domain/repository/withdraw-request.repository';
import { RequestStatus } from '../../../../core/domain/entity/enum/request-status.enum';

@Injectable()
export class ApproveWithdrawRequestUsecase
  implements UseCase<string, WithdrawRequest>
{
  constructor(
    @Inject('WithdrawRequestRepository')
    private withdrawRequestRepository: WithdrawRequestRepository,
  ) {}

  async execute(withdrawRequestId: string): Promise<WithdrawRequest> {
    const withdrawRequest =
      await this.withdrawRequestRepository.getWithdrawRequestById(
        withdrawRequestId,
      );

    if (!withdrawRequest) {
      throw new NotFoundException('Withdraw request not found');
    }

    if (withdrawRequest.status !== RequestStatus.PENDING) {
      throw new BadRequestException('Withdraw request is not pending');
    }

    withdrawRequest.status = RequestStatus.APPROVED;

    return await this.withdrawRequestRepository.save(withdrawRequest);
  }
}
