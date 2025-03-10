import { UseCase } from '../../../usecase.interface';
import { Inject } from '@nestjs/common';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';

export class CountTherapistHasTherapyIdUsecase
  implements UseCase<string, number>
{
  constructor(
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(therapyId: string): Promise<number> {
    return this.therapistRepository.countTherapistHasTherapyId(therapyId);
  }
}
