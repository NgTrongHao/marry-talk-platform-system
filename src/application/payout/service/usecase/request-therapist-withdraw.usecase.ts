import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { WithdrawRequest } from '../../../../core/domain/entity/withdraw-request.entity';
import { WithdrawRequestRepository } from '../../../../core/domain/repository/withdraw-request.repository';
import { ITherapistManagementService } from '../../../therapist-management/therapist-management-service.interface';

interface RequestTherapistWithdrawUsecaseCommand {
  therapistId: string;
  amount: number;
  currency: string;
  payoutAccountId: string;
}

@Injectable()
export class RequestTherapistWithdrawUsecase
  implements UseCase<RequestTherapistWithdrawUsecaseCommand, WithdrawRequest>
{
  constructor(
    @Inject('ITherapistManagementService')
    private therapistManagementService: ITherapistManagementService,
    @Inject('WithdrawRequestRepository')
    private withdrawRequestRepository: WithdrawRequestRepository,
  ) {}

  async execute(
    command: RequestTherapistWithdrawUsecaseCommand,
  ): Promise<WithdrawRequest> {
    //get last withdraw request
    const lastWithdrawRequest =
      await this.withdrawRequestRepository.getLastWithdrawRequest(
        command.therapistId,
      );

    //check if last withdraw request is not null and gap between last withdraw request and current date is less than 30 days
    if (
      lastWithdrawRequest &&
      new Date().getTime() - lastWithdrawRequest.createdAt!.getTime() <
        30 * 24 * 60 * 60 * 1000
    ) {
      throw new BadRequestException(
        'You can only request for withdrawal once in 30 days',
      );
    }

    const therapistBalance =
      await this.therapistManagementService.getTherapistBalance(
        command.therapistId,
      );

    if (therapistBalance.balance < command.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    therapistBalance.balance -= command.amount;

    await this.withdrawRequestRepository.updateTherapistBalance(
      command.therapistId,
      therapistBalance.balance,
    );

    const withdrawRequest = WithdrawRequest.create({
      therapistId: command.therapistId,
      amount: command.amount,
      currency: command.currency,
      payoutAccountId: command.payoutAccountId,
    });

    return await this.withdrawRequestRepository.save(withdrawRequest);
  }
}
