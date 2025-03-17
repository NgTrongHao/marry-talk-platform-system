import { UseCase } from '../../../usecase.interface';
import { WithdrawRequest } from '../../../../core/domain/entity/withdraw-request.entity';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ITherapistManagementService } from '../../../therapist-management/therapist-management-service.interface';
import { WithdrawRequestRepository } from '../../../../core/domain/repository/withdraw-request.repository';
import { RequestStatus } from '../../../../core/domain/entity/enum/request-status.enum';

@Injectable()
export class RejectWithdrawRequestUsecase
  implements UseCase<string, WithdrawRequest>
{
  constructor(
    @Inject('ITherapistManagementService')
    private therapistManagementService: ITherapistManagementService,
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

    if (
      withdrawRequest.status !== RequestStatus.PENDING &&
      withdrawRequest.status !== RequestStatus.APPROVED
    ) {
      throw new BadRequestException(
        'Withdraw request is not pending or approved',
      );
    }

    withdrawRequest.status = RequestStatus.REJECTED;

    const therapistBalance =
      await this.therapistManagementService.getTherapistBalance(
        withdrawRequest.therapistId,
      );

    therapistBalance.balance += withdrawRequest.amount;

    await this.withdrawRequestRepository.updateTherapistBalance(
      withdrawRequest.therapistId,
      therapistBalance.balance,
    );

    return await this.withdrawRequestRepository.save(withdrawRequest);
  }
}
