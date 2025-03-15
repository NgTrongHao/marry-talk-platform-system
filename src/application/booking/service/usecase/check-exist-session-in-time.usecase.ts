import { UseCase } from '../../../usecase.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';

export interface CheckExistSessionInTimeUsecaseCommand {
  therapistId: string;
  sessionDate: Date;
  startTime: string;
  endTime: string;
}

@Injectable()
export class CheckExistSessionInTimeUsecase implements UseCase<any, any> {
  constructor(
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
  ) {}

  async execute(command: CheckExistSessionInTimeUsecaseCommand): Promise<any> {
    const existingSessions =
      await this.sessionRepository.findByTherapistAndDate(
        command.therapistId,
        command.sessionDate,
      );

    for (const session of existingSessions) {
      if (
        this.isTimeOverlapping(
          session.startTime,
          session.endTime,
          command.startTime,
          command.endTime,
        )
      ) {
        throw new BadRequestException(
          'Another session is already scheduled at this time',
        );
      }
    }

    return true;
  }

  private isTimeOverlapping(
    existingStart: string,
    existingEnd: string,
    newStart: string,
    newEnd: string,
  ): boolean {
    const existingStartMin = this.convertTimeToMinutes(existingStart);
    const existingEndMin = this.convertTimeToMinutes(existingEnd);
    const newStartMin = this.convertTimeToMinutes(newStart);
    const newEndMin = this.convertTimeToMinutes(newEnd);

    return !(newEndMin <= existingStartMin || newStartMin >= existingEndMin);
  }

  private convertTimeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}
