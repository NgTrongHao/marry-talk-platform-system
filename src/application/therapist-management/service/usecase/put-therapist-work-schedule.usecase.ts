import { DayOfWeek } from '../../../../core/domain/entity/enum/day-of-week.enum';
import { UseCase } from '../../../usecase.interface';
import { WorkingHours } from '../../../../core/domain/entity/working-hours.entity';
import { Inject, Injectable } from '@nestjs/common';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { GetTherapistWorkScheduleUsecase } from './get-therapist-work-schedule.usecase';

export interface PutTherapistWorkScheduleUsecaseCommand {
  therapistId: string;
  workSchedule: {
    dayOfWeek: DayOfWeek;
    startTime: string;
    endTime: string;
  }[];
}

@Injectable()
export class PutTherapistWorkScheduleUsecase
  implements UseCase<PutTherapistWorkScheduleUsecaseCommand, WorkingHours[]>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(
    command: PutTherapistWorkScheduleUsecaseCommand,
  ): Promise<WorkingHours[]> {
    const workSchedule = WorkingHours.updateWorkingHours({
      workingHours: command.workSchedule,
    });

    console.info('WorkSchedule', workSchedule);

    await this.therapistRepository.putTherapistWorkSchedule(
      command.therapistId,
      workSchedule,
    );

    return this.usecaseHandler.execute(
      GetTherapistWorkScheduleUsecase,
      command.therapistId,
    );
  }
}
