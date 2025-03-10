import { FirebaseLoginUsecaseCommand } from './service/usecase/firebase-login.usecase';
import { LoginUserUseCaseResponse } from '../../../application/user/service/usecase/login-user.usecase';
import { CreateUserUsecaseResponse } from '../../../application/user/service/usecase/register-user.usecase';

export interface IFirebaseService {
  loginWithGoogle(request: FirebaseLoginUsecaseCommand): Promise<
    | LoginUserUseCaseResponse
    | {
        user: CreateUserUsecaseResponse;
        accessToken: string;
      }
    | {
        idToken: string;
        requiredUsername: boolean;
      }
  >;

  uploadFile(file: Express.Multer.File): Promise<string>;
}
