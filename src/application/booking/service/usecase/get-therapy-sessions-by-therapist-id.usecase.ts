import { UseCase } from '../../../usecase.interface';
import { Session } from '../../../../core/domain/entity/session.entity';
import { Inject, Injectable } from '@nestjs/common';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';

export interface GetTherapySessionsByTherapistIdUsecaseCommand {
  therapistId: string;
  status?: ProgressStatus;
  from?: Date;
  to?: Date;
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
      command.status,
      command.from,
      command.to,
    );
  }
}
