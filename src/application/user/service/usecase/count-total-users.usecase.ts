import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../core/domain/repository/user.repository';
import { UseCase } from '../../../usecase.interface';

interface CountTotalUsersUsecaseCommand {
  startDate: Date;
  endDate: Date;
}

@Injectable()
export class CountTotalUsersUsecase
  implements UseCase<CountTotalUsersUsecaseCommand, number>
{
  constructor(
    @Inject('UserRepository') private userRepository: UserRepository,
  ) {}

  async execute(command?: CountTotalUsersUsecaseCommand): Promise<number> {
    if (command != null && command.startDate > command.endDate) {
      throw new BadRequestException('Invalid date range');
    }
    return this.userRepository.countTotalUsers(
      command?.startDate,
      command?.endDate,
    );
  }
}
