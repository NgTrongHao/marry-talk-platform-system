import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { IServicePackageManagementService } from '../../../service-package-management/service-package-management-service.interface';
import { ITherapistManagementService } from '../../../therapist-management/therapist-management-service.interface';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';
import { Booking } from '../../../../core/domain/entity/booking.entity';
import { numberToDayOfWeek } from '../../../../core/domain/entity/enum/day-of-week.enum';
import { TimeHelperUtils } from '../../../shared/utils/time-helper.utils';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';

interface ValidateTherapySessionUsecaseCommand {
  sessionDate: Date;
  startTime: string;
  booking: Booking;
}

@Injectable()
export class ValidateTherapySessionUsecase
  implements UseCase<ValidateTherapySessionUsecaseCommand, void>
{
  constructor(
    @Inject('IServicePackageManagementService')
    private readonly servicePackageManagementService: IServicePackageManagementService,
    @Inject('ITherapistManagementService')
    private therapistManagementService: ITherapistManagementService,
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
  ) {}

  async execute(command: ValidateTherapySessionUsecaseCommand) {
    const therapistService =
      await this.servicePackageManagementService.getTherapistServiceById(
        command.booking.therapistServiceId,
      );

    const therapistWorkingSchedule = await this.getTherapistWorkingSchedule(
      therapistService.therapistId,
    );
    console.log('therapistWorkingSchedule', therapistWorkingSchedule);

    const sessionDate = new Date(command.sessionDate);
    if (isNaN(sessionDate.getTime())) {
      throw new BadRequestException('Invalid session date');
    }

    const dayOfWeek = numberToDayOfWeek[
      sessionDate.getDay()
    ] as keyof typeof therapistWorkingSchedule;

    const schedule = therapistWorkingSchedule[dayOfWeek];
    if (!schedule) {
      throw new BadRequestException('Therapist is not working on this day');
    }

    const startMinutes = TimeHelperUtils.convertTimeToMinutes(
      command.startTime,
    );
    const endMinutes = startMinutes + therapistService.timeInMinutes;
    if (!this.isWithinSchedule(schedule, startMinutes, endMinutes)) {
      throw new BadRequestException('Therapist is not available at this time');
    }

    await this.validateSessionCount(command.booking);
    await this.checkSessionConflict(
      therapistService.therapistId,
      command.sessionDate,
      command.startTime,
      TimeHelperUtils.convertMinutesToTime(endMinutes),
    );
  }

  private async validateSessionCount(booking: Booking) {
    const sessionCount = booking.therapistService?.package?.sessionCount;
    if (sessionCount === undefined) {
      throw new BadRequestException('Session count is not defined');
    }

    const sessions = await this.sessionRepository.getSessionsByBookingId(
      booking.id!,
    );

    const validSessions = sessions.filter(
      (session) => session.progressStatus !== ProgressStatus.CANCELLED,
    );

    if (validSessions.length + 1 > sessionCount) {
      throw new BadRequestException('Exceeded maximum session count');
    }
  }

  private async checkSessionConflict(
    therapistId: string,
    sessionDate: Date,
    startTime: string,
    endTime: string,
  ) {
    let existingSessions = await this.sessionRepository
      .findByTherapistAndDate(therapistId, undefined, sessionDate, sessionDate)
      .then((sessions) => {
        return sessions.filter(
          (session) => session.progressStatus !== ProgressStatus.CANCELLED,
        );
      });

    existingSessions = existingSessions.filter((session) => {
      const isExpired = new Date(session.booking.expiresAt!) <= new Date();
      return !isExpired;
    });

    for (const session of existingSessions) {
      if (
        TimeHelperUtils.isTimeOverlapping(
          session.startTime,
          session.endTime,
          startTime,
          endTime,
        )
      ) {
        throw new BadRequestException(
          'Another session is already scheduled at this time',
        );
      }
    }
  }

  private isWithinSchedule(
    schedule: { startTime: string; endTime: string },
    startMinutes: number,
    endMinutes: number,
  ): boolean {
    const scheduleStart = TimeHelperUtils.convertTimeToMinutes(
      schedule.startTime,
    );
    const scheduleEnd = TimeHelperUtils.convertTimeToMinutes(schedule.endTime);
    return startMinutes >= scheduleStart && endMinutes <= scheduleEnd;
  }

  private async getTherapistWorkingSchedule(therapistId: string) {
    const workingHours =
      await this.therapistManagementService.getTherapistWorkingHours(
        therapistId,
      );
    return workingHours.reduce((acc, cur) => {
      acc[cur.dayOfWeek] = {
        startTime: cur.startTime,
        endTime: cur.endTime,
      };
      return acc;
    }, {});
  }
}
