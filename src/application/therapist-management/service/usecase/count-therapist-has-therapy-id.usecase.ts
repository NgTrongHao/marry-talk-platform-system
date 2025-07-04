import { UseCase } from '../../../usecase.interface';
import { Inject, Injectable } from '@nestjs/common';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';

@Injectable()
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
