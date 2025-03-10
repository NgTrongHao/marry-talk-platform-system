import { CreateUserUsecaseCommand } from './service/usecase/create-user.usecase';
import { CreateUserUsecaseResponse } from './service/usecase/register-user.usecase';
import {
  LoginUserUseCaseCommand,
  LoginUserUseCaseResponse,
} from './service/usecase/login-user.usecase';
import { User } from '../../core/domain/entity/user.entity';

export interface IAuthService {
  /**
   * Register a new user
   * @param registerUser
   * @returns {Promise<{ user: CreateUserUsecaseResponse; accessToken: string }>}
   * @memberof IAuthService
   * @implementsBy AuthService
   * @author NgTrongHao
   */
  register(
    registerUser: CreateUserUsecaseCommand,
  ): Promise<{ user: CreateUserUsecaseResponse; accessToken: string }>;

  /**
   * Login a user
   * @param request
   * @returns {Promise<LoginUserUseCaseResponse>}
   * @memberof IAuthService
   * @implementsBy AuthService
   * @author NgTrongHao
   */
  login(request: LoginUserUseCaseCommand): Promise<LoginUserUseCaseResponse>;

  generateAccessToken(user: User): Promise<string>;
}
