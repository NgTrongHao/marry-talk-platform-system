import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { Session } from '../../../../core/domain/entity/session.entity';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';

interface AddMeetingLinkSessionUsecaseCommand {
  sessionId: string;
  meetingLink: string;
}

@Injectable()
export class AddMeetingLinkSessionUsecase
  implements UseCase<AddMeetingLinkSessionUsecaseCommand, Session>
{
  constructor(
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
  ) {}

  async execute(
    command: AddMeetingLinkSessionUsecaseCommand,
  ): Promise<Session> {
    const session = await this.sessionRepository.findSessionById(
      command.sessionId,
    );
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    session.meetingUrl = command.meetingLink;
    return this.sessionRepository.save(session);
  }
}
