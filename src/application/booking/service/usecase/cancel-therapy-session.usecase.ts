import { UseCase } from '../../../usecase.interface';
import { Session } from '../../../../core/domain/entity/session.entity';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';

export class CancelTherapySessionUsecase implements UseCase<string, Session> {
  constructor(
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
  ) {}

  async execute(sessionId: string): Promise<Session> {
    const session = await this.sessionRepository.findSessionById(sessionId);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // check if session is already cancelled
    if (session.progressStatus === ProgressStatus.CANCELLED) {
      return session;
    }

    // check if session is already completed
    if (session.progressStatus === ProgressStatus.COMPLETED) {
      throw new NotFoundException('Session is already completed');
    }

    // check for cancel before 24 hours
    const currentDate = new Date();
    const sessionDate = new Date(session.sessionDate);
    const diffTime = Math.abs(sessionDate.getTime() - currentDate.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    if (diffHours < 24) {
      throw new BadRequestException('Cannot cancel session within 24 hours');
    }

    session.progressStatus = ProgressStatus.CANCELLED;
    return await this.sessionRepository.save(session);
  }
}
