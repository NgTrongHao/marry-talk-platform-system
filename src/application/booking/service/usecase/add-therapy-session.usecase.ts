import { UseCase } from '../../../usecase.interface';
import { Session } from '../../../../core/domain/entity/session.entity';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';
import { ValidateTherapySessionUsecase } from './validate-therapy-session.usecase';
import { TimeHelperUtils } from '../../../shared/utils/time-helper.utils';

export interface AddTherapySessionUsecaseCommand {
  bookingId: string;
  sessionDate: Date;
  startTime: string;
}

@Injectable()
export class AddTherapySessionUsecase
  implements UseCase<AddTherapySessionUsecaseCommand, Session>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
    @Inject('BookingRepository') private bookingRepository: BookingRepository,
  ) {}

  async execute(command: AddTherapySessionUsecaseCommand): Promise<Session> {
    const booking = await this.bookingRepository.findBookingById(
      command.bookingId,
    );
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.expiresAt! < new Date()) {
      throw new BadRequestException('Booking has expired');
    }

    await this.usecaseHandler.execute(ValidateTherapySessionUsecase, {
      booking,
      ...command,
    });

    const sessionNumber =
      (
        await this.sessionRepository
          .getSessionsByBookingId(booking.id!)
          .then((sessions: Session[]) => {
            return sessions.filter(
              (session) => session.progressStatus !== ProgressStatus.CANCELLED,
            );
          })
      ).length + 1;
    const endMinutes =
      TimeHelperUtils.convertTimeToMinutes(command.startTime) +
      booking.therapistService!.timeInMinutes;
    const endTime = TimeHelperUtils.convertMinutesToTime(endMinutes);

    const session = Session.create({
      sessionNumber,
      progressStatus: ProgressStatus.PENDING,
      sessionDate: command.sessionDate,
      meetingUrl: '',
      booking,
      startTime: command.startTime,
      endTime: endTime,
    });

    return this.sessionRepository.save(session);
  }
}
