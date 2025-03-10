import { Injectable } from '@nestjs/common';
import { IAuthService } from '../auth-service.interface';
import { CreateUserUsecaseCommand } from './usecase/create-user.usecase';
import { RegisterUserUsecase } from './usecase/register-user.usecase';
import {
  LoginUserUsecase,
  LoginUserUseCaseCommand,
} from './usecase/login-user.usecase';
import { GenerateAccessTokenUsecase } from './usecase/generate-access-token.usecase';
import { User } from '../../../core/domain/entity/user.entity';
import { UsecaseHandler } from '../../usecase-handler.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(private useCaseHandler: UsecaseHandler) {}

  register(request: CreateUserUsecaseCommand) {
    return this.useCaseHandler.execute(RegisterUserUsecase, request);
  }

  login(request: LoginUserUseCaseCommand) {
    return this.useCaseHandler.execute(LoginUserUsecase, request);
  }

  generateAccessToken(request: User) {
    return this.useCaseHandler.execute(GenerateAccessTokenUsecase, request);
  }
}
