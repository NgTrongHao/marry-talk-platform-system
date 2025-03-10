import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../core/domain/repository/user.repository';
import { User } from '../../../../core/domain/entity/user.entity';
import { UseCase } from '../../../usecase.interface';

interface GetAllUsersUsecasePaginationCommand {
  skip: number;
  take: number;
}

@Injectable()
export class GetAllUsersUsecase
  implements UseCase<GetAllUsersUsecasePaginationCommand, User[]>
{
  constructor(
    @Inject('UserRepository') private userRepository: UserRepository,
  ) {}

  async execute(command: GetAllUsersUsecasePaginationCommand): Promise<User[]> {
    return await this.userRepository.findAll(command.skip, command.take);
  }
}
