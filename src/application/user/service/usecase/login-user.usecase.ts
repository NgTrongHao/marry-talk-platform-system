import { GetUserByUsernameUsecase } from './get-user-by-username.usecase';
import { User } from '../../../../core/domain/entity/user.entity';
import { HashPasswordService } from '../hash-password.service';
import { GenerateAccessTokenUsecase } from './generate-access-token.usecase';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Member } from '../../../../core/domain/entity/member.entity';
import { UseCase } from '../../../usecase.interface';
import { UsecaseHandler } from '../../../usecase-handler.service';

export interface LoginUserUseCaseCommand {
  username: string;
  password: string;
}

export interface LoginUserUseCaseResponse {
  token: string;
}

@Injectable()
export class LoginUserUsecase
  implements UseCase<LoginUserUseCaseCommand, LoginUserUseCaseResponse>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('HashPasswordService')
    private hashPasswordService: HashPasswordService,
  ) {}

  async execute(
    command: LoginUserUseCaseCommand,
  ): Promise<LoginUserUseCaseResponse> {
    let user: User | Member;
    try {
      user = await this.usecaseHandler.execute(GetUserByUsernameUsecase, {
        username: command.username,
      });
    } catch {
      throw new BadRequestException('Invalid username');
    }

    const isPasswordValid = await User.validatePassword(
      command.password,
      user instanceof User ? user.password : user.user.password,
      this.hashPasswordService,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    return {
      token: await this.usecaseHandler.execute(
        GenerateAccessTokenUsecase,
        user instanceof User ? user : user.user,
      ),
    };
  }
}
