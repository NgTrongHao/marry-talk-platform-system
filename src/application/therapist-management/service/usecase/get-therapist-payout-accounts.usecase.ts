import { UseCase } from '../../../usecase.interface';
import { TherapistPayoutAccount } from '../../../../core/domain/entity/therapist-payout-account.entity';
import { Inject, Injectable } from '@nestjs/common';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';

@Injectable()
export class GetTherapistPayoutAccountsUsecase
  implements UseCase<string, TherapistPayoutAccount[]>
{
  constructor(
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(therapistId: string): Promise<TherapistPayoutAccount[]> {
    return await this.therapistRepository.getTherapistPayoutAccounts(
      therapistId,
    );
  }
}
