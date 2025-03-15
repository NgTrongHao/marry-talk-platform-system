import { UseCase } from '../../../usecase.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';
import { TherapistPayoutAccount } from '../../../../core/domain/entity/therapist-payout-account.entity';

interface AddPayoutAccountUsecaseCommand {
  therapistId: string;
  accountNumber: string;
  bankCode: string;
  accountName?: string;
}

@Injectable()
export class AddPayoutAccountUseCase
  implements UseCase<AddPayoutAccountUsecaseCommand, TherapistPayoutAccount>
{
  constructor(
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(
    command: AddPayoutAccountUsecaseCommand,
  ): Promise<TherapistPayoutAccount> {
    const therapist = await this.therapistRepository.getTherapistProfileById(
      command.therapistId,
    );

    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    const payoutAccount = TherapistPayoutAccount.create({
      therapistId: command.therapistId,
      accountNumber: command.accountNumber,
      bankCode: command.bankCode,
      accountName: command.accountName,
    });

    return this.therapistRepository.addPayoutAccount(payoutAccount);
  }
}
