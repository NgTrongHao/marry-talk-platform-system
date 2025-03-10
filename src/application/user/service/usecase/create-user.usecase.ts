import { Inject, Injectable } from '@nestjs/common';
import { UserRepository } from '../../../../core/domain/repository/user.repository';
import { User } from '../../../../core/domain/entity/user.entity';
import { HashPasswordService } from '../hash-password.service';
import { UseCase } from '../../../usecase.interface';

export interface CreateUserUsecaseCommand {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

@Injectable()
export class CreateUserUsecase
  implements UseCase<CreateUserUsecaseCommand, User>
{
  constructor(
    @Inject('UserRepository') private userRepository: UserRepository,
    @Inject('HashPasswordService')
    private readonly hashService: HashPasswordService,
  ) {}

  async execute(command: CreateUserUsecaseCommand): Promise<User> {
    const { firstName, lastName, email, username, password } = command;

    const user = await User.create(
      {
        firstName,
        lastName,
        email,
        username,
        password,
      },
      this.hashService,
    );

    return await this.userRepository.createUser(user);
  }
}
