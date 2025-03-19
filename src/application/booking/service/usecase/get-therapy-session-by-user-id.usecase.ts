import { Inject, Injectable } from '@nestjs/common';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';
import { UseCase } from '../../../usecase.interface';
import { Session } from '../../../../core/domain/entity/session.entity';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';
import { IUsersService } from '../../../user/users-service.interface';

interface GetTherapySessionByUserIdUsecaseCommand {
  userId: string;
  page: number;
  limit: number;
  from: Date | undefined;
  to: Date | undefined;
  status: ProgressStatus | undefined;
}

@Injectable()
export class GetTherapySessionByUserIdUsecase
  implements UseCase<GetTherapySessionByUserIdUsecaseCommand, Session[]>
{
  constructor(
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
    @Inject('IUsersService') private readonly userService: IUsersService,
  ) {}

  async execute(
    command: GetTherapySessionByUserIdUsecaseCommand,
  ): Promise<Session[]> {
    await this.userService.getUserById({
      userId: command.userId,
    });

    return this.sessionRepository.getTherapySessionByUserId(
      command.userId,
      command.page,
      command.limit,
      command.from,
      command.to,
      command.status,
    );
  }
}
