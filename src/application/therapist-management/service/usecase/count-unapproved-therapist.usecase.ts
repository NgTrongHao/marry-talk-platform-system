import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';

@Injectable()
export class CountUnapprovedTherapistUsecase
  implements UseCase<string | undefined, number>
{
  constructor(
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(therapyId?: string): Promise<number> {
    return this.therapistRepository.countUnapprovedTherapist(therapyId);
  }
}
