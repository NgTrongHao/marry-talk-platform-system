import { UseCase } from '../../../usecase.interface';
import { TherapistPayoutAccount } from '../../../../core/domain/entity/therapist-payout-account.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';

@Injectable()
export class GetPayoutAccountByIdUsecase
  implements UseCase<string, TherapistPayoutAccount>
{
  constructor(
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(payoutAccountId: string): Promise<TherapistPayoutAccount> {
    const account =
      await this.therapistRepository.getTherapistPayoutAccountById(
        payoutAccountId,
      );

    if (!account) {
      throw new NotFoundException('Payout account not found');
    }

    return account;
  }
}
