import { UseCase } from '../../../usecase.interface';
import { Session } from '../../../../core/domain/entity/session.entity';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { CompleteBookingUsecase } from './complete-booking.usecase';

@Injectable()
export class CompleteTherapySessionUsecase implements UseCase<string, Session> {
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
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

    // check is last session, if last session, complete booking
    if (validSessions.length === session.sessionNumber) {
      await this.usecaseHandler.execute(
        CompleteBookingUsecase,
        session.booking.id,
      );
    }

    session.progressStatus = ProgressStatus.COMPLETED;

    return this.sessionRepository.save(session);
  }
}
