import { UseCase } from '../../../usecase.interface';
import { Inject, Injectable } from '@nestjs/common';
import { WithdrawRequestRepository } from '../../../../core/domain/repository/withdraw-request.repository';
import { RequestStatus } from '../../../../core/domain/entity/enum/request-status.enum';

interface CountTherapistWithdrawRequestsUsecaseCommand {
  therapistId: string;
  accountPayoutId?: string;
  status?: RequestStatus;
}

@Injectable()
export class CountTherapistWithdrawRequestsUsecase
  implements UseCase<CountTherapistWithdrawRequestsUsecaseCommand, number>
{
  constructor(
    @Inject('WithdrawRequestRepository')
    private withdrawRequestRepository: WithdrawRequestRepository,
  ) {}

  async execute(
    command: CountTherapistWithdrawRequestsUsecaseCommand,
  ): Promise<number> {
    return await this.withdrawRequestRepository.countWithdrawRequestsByTherapistId(
      command.therapistId,
      command.accountPayoutId,
      command.status,
    );
  }
}
