import { UseCase } from '../../../usecase.interface';
import { RequestStatus } from '../../../../core/domain/entity/enum/request-status.enum';
import { Inject, Injectable } from '@nestjs/common';
import { WithdrawRequestRepository } from '../../../../core/domain/repository/withdraw-request.repository';

@Injectable()
export class CountAllWithdrawRequestsUsecase
  implements UseCase<RequestStatus, number>
{
  constructor(
    @Inject('WithdrawRequestRepository')
    private withdrawRequestRepository: WithdrawRequestRepository,
  ) {}

  async execute(status?: RequestStatus): Promise<number> {
    return await this.withdrawRequestRepository.countAllWithdrawRequests(
      status,
    );
  }
}
