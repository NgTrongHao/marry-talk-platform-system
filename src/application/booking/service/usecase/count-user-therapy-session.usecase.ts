import { UseCase } from '../../../usecase.interface';
import { Inject, Injectable } from '@nestjs/common';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';
import { IUsersService } from '../../../user/users-service.interface';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';

interface CountUserTherapySessionUsecaseCommand {
  userId: string;
  from: Date | undefined;
  to: Date | undefined;
  status: ProgressStatus | undefined;
}

@Injectable()
export class CountUserTherapySessionUsecase
  implements UseCase<CountUserTherapySessionUsecaseCommand, number>
{
  constructor(
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
    @Inject('IUsersService') private readonly userService: IUsersService,
  ) {}

  async execute(
    command: CountUserTherapySessionUsecaseCommand,
  ): Promise<number> {
    await this.userService.getUserById({
      userId: command.userId,
    });

    return this.sessionRepository.countTherapySessionByUserId(
      command.userId,
      command.from,
      command.to,
      command.status,
    );
  }
}
