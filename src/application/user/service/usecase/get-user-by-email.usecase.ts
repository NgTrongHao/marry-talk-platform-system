import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../core/domain/repository/user.repository';
import { UseCase } from '../../../usecase.interface';
import { User } from '../../../../core/domain/entity/user.entity';

export interface GetUserByEmailUsecaseCommand {
  email: string;
}

@Injectable()
export class GetUserByEmailUsecase
  implements UseCase<GetUserByEmailUsecaseCommand, User>
{
  constructor(
    @Inject('UserRepository') private userRepository: UserRepository,
  ) {}

  async execute(command: GetUserByEmailUsecaseCommand) {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
