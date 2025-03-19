import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';
import { Therapist } from '../../../../core/domain/entity/therapist.entity';
import { TherapistType } from '../../../../core/domain/entity/therapist-type.entity';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';
import {
  DayOfWeek,
  numberToDayOfWeek,
} from '../../../../core/domain/entity/enum/day-of-week.enum';

interface FindTherapistsByTherapyIdUsecaseCommand {
  therapyId: string;
  skip: number;
  take: number;
  sessionDate?: Date;
  startTime?: string;
  endTime?: string;
}

@Injectable()
export class FindTherapistsByTherapyIdUsecase
  implements
    UseCase<
      FindTherapistsByTherapyIdUsecaseCommand,
      { therapist: Therapist; therapistTypes: TherapistType[] }[]
    >
{
  constructor(
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
  ) {}

  async execute(
    command: FindTherapistsByTherapyIdUsecaseCommand,
  ): Promise<{ therapist: Therapist; therapistTypes: TherapistType[] }[]> {
    const results: {
      therapist: Therapist;
      therapistTypes: TherapistType[];
    }[] = await this.therapistRepository.findTherapistsByTherapyId(
      command.therapyId,
      command.skip,
      command.take,
    );
    const enabledTherapists = results.filter(
      (result) => result.therapist.roleEnabled,
    );

    const availableTherapists: {
      therapist: Therapist;
      therapistTypes: TherapistType[];
    }[] = [];

    for (const therapistData of enabledTherapists) {
      const { therapist, therapistTypes } = therapistData;

      const therapistWorkingSchedule = await this.getTherapistWorkingSchedule(
        therapist.user.id!,
      );

      const dayOfWeek = numberToDayOfWeek[command.sessionDate!.getDay()];

      const schedule = therapistWorkingSchedule[dayOfWeek];

      if (!schedule) {
        continue;
      }

      const startWorking = schedule.startTime;
      const endWorking = schedule.endTime;

      const bookedSessions =
        await this.sessionRepository.findByTherapistAndDate(
          therapist.user.id!,
          undefined,
          command.sessionDate,
          undefined,
        );

      const isAvailable = this.hasAvailableTimeSlot(
        bookedSessions,
        startWorking,
        endWorking,
        command.startTime,
        command.endTime,
      );

      if (isAvailable) {
        availableTherapists.push({ therapist, therapistTypes });
      }
    }

    return availableTherapists.sort((therapist) => {
      return therapist.therapist.rating;
    });
  }

  private async getTherapistWorkingSchedule(
    therapistId: string,
  ): Promise<Record<DayOfWeek, { startTime: string; endTime: string }>> {
    const workingHours =
      await this.therapistRepository.getTherapistWorkSchedule(therapistId);
    return workingHours.reduce(
      (acc, cur) => {
        acc[cur.dayOfWeek] = {
          startTime: cur.startTime,
          endTime: cur.endTime,
        };
        return acc;
      },
      {} as Record<DayOfWeek, { startTime: string; endTime: string }>,
    );
  }

  private hasAvailableTimeSlot(
    bookedSessions: { startTime: string; endTime: string }[],
    workingStart: string,
    workingEnd: string,
    filterStart?: string,
    filterEnd?: string,
  ): boolean {
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const workingStartMins = timeToMinutes(workingStart);
    const workingEndMins = timeToMinutes(workingEnd);
    let filterStartMins = filterStart
      ? timeToMinutes(filterStart)
      : workingStartMins;
    let filterEndMins = filterEnd ? timeToMinutes(filterEnd) : workingEndMins;

    if (!filterStart && !filterEnd) return true;

    if (filterStartMins < workingStartMins) filterStartMins = workingStartMins;
    if (filterEndMins > workingEndMins) filterEndMins = workingEndMins;

    bookedSessions.sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime),
    );
    let lastEndTime = workingStartMins;

    for (const session of bookedSessions) {
      const sessionStart = timeToMinutes(session.startTime);
      const sessionEnd = timeToMinutes(session.endTime);

      if (
        lastEndTime < sessionStart &&
        filterStartMins >= lastEndTime &&
        filterEndMins <= sessionStart
      ) {
        return true;
      }

      lastEndTime = sessionEnd;
    }

    return (
      lastEndTime < workingEndMins &&
      filterStartMins >= lastEndTime &&
      filterEndMins <= workingEndMins
    );
  }
}
