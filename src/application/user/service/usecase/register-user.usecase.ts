import { ConflictException, Injectable } from '@nestjs/common';
import {
  CreateUserUsecase,
  CreateUserUsecaseCommand,
} from './create-user.usecase';
import { CheckDuplicateUserUsecase } from './check-duplicate-user.usecase';
import { GenerateAccessTokenUsecase } from './generate-access-token.usecase';
import { UseCase } from '../../../usecase.interface';
import { UsecaseHandler } from '../../../usecase-handler.service';

export interface CreateUserUsecaseResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class RegisterUserUsecase
  implements
    UseCase<
      CreateUserUsecaseCommand,
      {
        user: CreateUserUsecaseResponse;
        accessToken: string;
      }
    >
{
  constructor(private usecaseHandler: UsecaseHandler) {}

  async execute(command: CreateUserUsecaseCommand) {
    // Check if the user already exists
    const isDuplicate = await this.usecaseHandler.execute(
      CheckDuplicateUserUsecase,
      command,
    );
    if (isDuplicate) {
      throw new ConflictException('Email or username already in use');
    }

    // Create the user
    const user = await this.usecaseHandler.execute(CreateUserUsecase, command);

    // Generate access token
    const accessToken = await this.usecaseHandler.execute(
      GenerateAccessTokenUsecase,
      user,
    );

    return {
      user: {
        id: user.id as string,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role?.toString() as string,
        createdAt: user.createdAt as Date,
        updatedAt: user.updatedAt as Date,
      },
      accessToken,
    };
  }
}
