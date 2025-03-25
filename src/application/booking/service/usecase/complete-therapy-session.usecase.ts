import { UseCase } from '../../../usecase.interface';
import { Session } from '../../../../core/domain/entity/session.entity';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';
import { CompleteBookingUsecase } from './complete-booking.usecase';

@Injectable()
export class CompleteTherapySessionUsecase implements UseCase<string, Session> {
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
    @Inject('BookingRepository') private bookingRepository: BookingRepository,
  ) {}

  async execute(sessionId: string): Promise<Session> {
    const session = await this.sessionRepository.findSessionById(sessionId);
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.progressStatus === ProgressStatus.COMPLETED) {
      throw new BadRequestException('Session already completed');
    }

    const now = new Date();
    const sessionDate = new Date(session.sessionDate);
    const endTime = session.endTime;

    const [hours, minutes] = endTime.split(':').map(Number);
    sessionDate.setHours(hours, minutes, 0, 0);

    if (now < sessionDate) {
      throw new BadRequestException('Session has not ended yet');
    }

    const sessions = await this.sessionRepository.getSessionsByBookingId(
      session.booking.id!,
    );

    const validSessions = sessions.filter(
      (session) => session.progressStatus !== ProgressStatus.CANCELLED,
    );

    const hasUncompletedPreviousSession = validSessions.some(
      (s) =>
        s.sessionNumber < session.sessionNumber &&
        s.progressStatus !== ProgressStatus.COMPLETED,
    );

    if (hasUncompletedPreviousSession) {
      throw new BadRequestException(
        'You cannot complete this session because a previous session is not completed yet',
      );
    }

    session.progressStatus = ProgressStatus.COMPLETED;

    const savedSession = await this.sessionRepository.save(session);

    const booking = await this.bookingRepository.findBookingById(
      session.booking.id!,
    );

    if (!booking) {
      throw new ConflictException('Booking not found');
    }

    if (
      booking.therapistService?.package.sessionCount === session.sessionNumber
    ) {
      await this.usecaseHandler.execute(
        CompleteBookingUsecase,
        session.booking.id,
      );
    }

    return savedSession;
  }
}
