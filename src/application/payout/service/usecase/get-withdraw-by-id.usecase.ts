import { UseCase } from '../../../usecase.interface';
import { WithdrawRequest } from '../../../../core/domain/entity/withdraw-request.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { WithdrawRequestRepository } from '../../../../core/domain/repository/withdraw-request.repository';

@Injectable()
export class GetWithdrawByIdUsecase
  implements UseCase<string, WithdrawRequest>
{
  constructor(
    @Inject('WithdrawRequestRepository')
    private withdrawRequestRepository: WithdrawRequestRepository,
  ) {}

  async execute(withdrawRequestId: string): Promise<WithdrawRequest> {
    const withdraw =
      await this.withdrawRequestRepository.getWithdrawRequestById(
        withdrawRequestId,
      );

    if (!withdraw) {
      throw new NotFoundException('Withdraw request not found');
    }

    return withdraw;
  }
}
