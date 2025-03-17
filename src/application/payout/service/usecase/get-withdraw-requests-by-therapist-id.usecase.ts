import { UseCase } from '../../../usecase.interface';
import { WithdrawRequest } from '../../../../core/domain/entity/withdraw-request.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ITherapistManagementService } from '../../../therapist-management/therapist-management-service.interface';
import { WithdrawRequestRepository } from '../../../../core/domain/repository/withdraw-request.repository';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';

interface GetWithdrawRequestsByTherapistIdUsecaseCommand {
  page: number;
  limit: number;
  status?: string;
  payoutAccountId?: string;
  therapistId: string;
}

@Injectable()
export class GetWithdrawRequestsByTherapistIdUsecase
  implements
    UseCase<GetWithdrawRequestsByTherapistIdUsecaseCommand, WithdrawRequest[]>
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
    command: GetWithdrawRequestsByTherapistIdUsecaseCommand,
  ): Promise<WithdrawRequest[]> {
    const therapist = await this.therapistRepository.getTherapistProfileById(
      command.therapistId,
    );

    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    const requests =
      await this.withdrawRequestRepository.getWithdrawRequestsByTherapistId(
        command.therapistId,
        command.page,
        command.limit,
        command.status,
        command.payoutAccountId,
      );

    // sort by updatedAt for recent requests
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
