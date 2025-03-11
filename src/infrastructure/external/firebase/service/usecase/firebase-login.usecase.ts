import { Inject, Injectable } from '@nestjs/common';
import { FirebaseVerifyIdTokenUsecase } from './firebase-verify-id-token.usecase';
import { CheckExistedUserUsecase } from './check-existed-user.usecase';
import { IUsersService } from '../../../../../application/user/users-service.interface';
import { IAuthService } from '../../../../../application/user/auth-service.interface';
import { LoginUserUseCaseResponse } from '../../../../../application/user/service/usecase/login-user.usecase';
import { CreateUserUsecaseResponse } from '../../../../../application/user/service/usecase/register-user.usecase';

export interface FirebaseLoginUsecaseCommand {
  idToken: string;
  username?: string;
}

@Injectable()
export class FirebaseLoginUsecase {
  constructor(
    private firebaseVerifyIdTokenUsecase: FirebaseVerifyIdTokenUsecase,
    private checkExistedUserUsecase: CheckExistedUserUsecase,
    @Inject('IUsersService') private readonly userService: IUsersService,
    @Inject('IAuthService') private readonly authService: IAuthService,
  ) {}

  async execute({ idToken, username }: FirebaseLoginUsecaseCommand): Promise<
    | LoginUserUseCaseResponse
    | {
        user: CreateUserUsecaseResponse;
        accessToken: string;
      }
    | {
        idToken: string;
        requiredUsername: boolean;
      }
  > {
    const firebaseUser =
      await this.firebaseVerifyIdTokenUsecase.execute(idToken);

    const existedUser = await this.checkExistedUserUsecase.execute(
      firebaseUser.email,
    );

    if (existedUser) {
      const user = await this.userService.getUserByEmail({
        email: firebaseUser.email,
      });
      const token = await this.authService.generateAccessToken(user);

      return { accessToken: token };
    } else if (username) {
      const nameParts = firebaseUser.displayName?.trim().split(' ') || [];
      const firstName = nameParts.slice(0, -1).join(' ') || '';
      const lastName = nameParts[nameParts.length - 1] || '';

      return await this.authService.register({
        email: firebaseUser.email,
        username,
        firstName,
        lastName,
        password: idToken,
      });
    } else {
      return {
        idToken: idToken,
        requiredUsername: true,
      };
    }
  }
}
