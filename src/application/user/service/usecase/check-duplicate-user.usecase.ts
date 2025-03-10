import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../core/domain/repository/user.repository';
import { UseCase } from '../../../usecase.interface';

interface CheckDuplicateUserUseCaseCommand {
  username?: string;
  email?: string;
}

@Injectable()
export class CheckDuplicateUserUsecase
  implements UseCase<CheckDuplicateUserUseCaseCommand, boolean>
{
  constructor(
    @Inject('UserRepository') private userRepository: UserRepository,
  ) {}

  async execute(command: CheckDuplicateUserUseCaseCommand) {
    if (command.email) {
      return (await this.userRepository.findByEmail(command.email)) !== null;
    }

    if (command.username) {
      return (
        (await this.userRepository.findByUsername(command.username)) !== null
      );
    }

    return true;
  }
}
