import { UseCase } from '../../../usecase.interface';
import { TherapistBalance } from '../../../../core/domain/entity/therapist-balance.entity';
import { Inject, Injectable } from '@nestjs/common';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';

@Injectable()
export class GetTherapistBalanceUsecase
  implements UseCase<string, TherapistBalance>
{
  constructor(
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(therapistId: string): Promise<TherapistBalance> {
    const balance =
      await this.therapistRepository.getTherapistBalance(therapistId);

    return balance != null
      ? balance
      : TherapistBalance.build({
          therapistId: therapistId,
          balance: 0,
          updatedAt: new Date(),
        });
  }
}
