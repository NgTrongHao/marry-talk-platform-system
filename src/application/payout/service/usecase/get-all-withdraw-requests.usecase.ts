import { UseCase } from '../../../usecase.interface';
import { WithdrawRequest } from '../../../../core/domain/entity/withdraw-request.entity';
import { Inject, Injectable } from '@nestjs/common';
import { ITherapistManagementService } from '../../../therapist-management/therapist-management-service.interface';
import { WithdrawRequestRepository } from '../../../../core/domain/repository/withdraw-request.repository';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';

interface GetWithdrawRequestsUsecaseCommand {
  page: number;
  limit: number;
  status?: string;
}

@Injectable()
export class GetAllWithdrawRequestsUsecase
  implements UseCase<GetWithdrawRequestsUsecaseCommand, WithdrawRequest[]>
{
  constructor(
    @Inject('ITherapistManagementService')
    private therapistManagementService: ITherapistManagementService,
    @Inject('WithdrawRequestRepository')
    private withdrawRequestRepository: WithdrawRequestRepository,
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(
    command: GetWithdrawRequestsUsecaseCommand,
  ): Promise<WithdrawRequest[]> {
    const requests =
      await this.withdrawRequestRepository.getAllWithdrawRequests(
        command.page,
        command.limit,
        command.status,
      );

    // sort requests by updated date
    return requests.sort((a, b) => {
      const updatedAtA = a.updatedAt!;
      const updatedAtB = b.updatedAt!;

      if (updatedAtA < updatedAtB) {
        return 1;
      }
      if (updatedAtA > updatedAtB) {
        return -1;
      }
      return 0;
    });
  }
}
