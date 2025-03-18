import { UseCase } from '../../../usecase.interface';
import { Session } from '../../../../core/domain/entity/session.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';

@Injectable()
export class GetTherapySessionByIdUsecase implements UseCase<string, Session> {
  constructor(
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
  ) {}

  async execute(sessionId: string): Promise<Session> {
    const session = await this.sessionRepository.findSessionById(sessionId);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }
}
