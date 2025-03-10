import { UseCase } from '../../../usecase.interface';
import { WorkingHours } from '../../../../core/domain/entity/working-hours.entity';
import { Inject, Injectable } from '@nestjs/common';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';

@Injectable()
export class GetTherapistWorkScheduleUsecase
  implements UseCase<string, WorkingHours[]>
{
  constructor(
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(therapistId: string): Promise<WorkingHours[]> {
    return this.therapistRepository.getTherapistWorkSchedule(therapistId);
  }
}
