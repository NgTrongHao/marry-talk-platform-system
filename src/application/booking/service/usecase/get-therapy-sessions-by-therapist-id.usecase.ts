import { UseCase } from '../../../usecase.interface';
import { Session } from '../../../../core/domain/entity/session.entity';
import { Inject, Injectable } from '@nestjs/common';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';

export interface GetTherapySessionsByTherapistIdUsecaseCommand {
  therapistId: string;
  date: Date;
}

@Injectable()
export class GetTherapySessionsByTherapistIdUsecase
  implements UseCase<GetTherapySessionsByTherapistIdUsecaseCommand, Session[]>
{
  constructor(
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
  ) {}

  async execute(
    command: GetTherapySessionsByTherapistIdUsecaseCommand,
  ): Promise<Session[]> {
    return await this.sessionRepository.findByTherapistAndDate(
      command.therapistId,
      command.date,
    );
  }
}
