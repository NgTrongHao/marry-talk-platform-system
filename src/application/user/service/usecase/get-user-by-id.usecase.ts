import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../core/domain/repository/user.repository';
import { User } from '../../../../core/domain/entity/user.entity';
import { UseCase } from '../../../usecase.interface';

export interface GetUserByIdUsecaseCommand {
  userId: string;
}

@Injectable()
export class GetUserByIdUsecase
  implements UseCase<GetUserByIdUsecaseCommand, User>
{
  constructor(
    @Inject('UserRepository') private userRepository: UserRepository,
  ) {}

  async execute(command: GetUserByIdUsecaseCommand): Promise<User> {
    const user = await this.userRepository.findById(command.userId);

    if (user == null) {
      throw new Error('User not found by id: ' + command.userId);
    }
    return user;
  }
}
