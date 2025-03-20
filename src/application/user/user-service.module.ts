import { Module } from '@nestjs/common';
import { CreateUserUsecase } from './service/usecase/create-user.usecase';
import { GetUserByUsernameUsecase } from './service/usecase/get-user-by-username.usecase';
import { UsersService } from './service/user.service';
import { GetUserByIdUsecase } from './service/usecase/get-user-by-id.usecase';
import { CheckDuplicateUserUsecase } from './service/usecase/check-duplicate-user.usecase';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { SecurityModule } from '../../infrastructure/security/security.module';
import { AuthService } from './service/auth.service';
import { RegisterUserUsecase } from './service/usecase/register-user.usecase';
import { LoginUserUsecase } from './service/usecase/login-user.usecase';
import { GenerateAccessTokenUsecase } from './service/usecase/generate-access-token.usecase';
import { GetAllUsersUsecase } from './service/usecase/get-all-users.usecase';
import { CountTotalUsersUsecase } from './service/usecase/count-total-users.usecase';
import { CreateMemberProfileUsecase } from './service/usecase/create-member-profile.usecase';
import { ChangeRoleUsecase } from './service/usecase/change-role.usecase';
import { CreateTherapistProfileUsecase } from './service/usecase/create-therapist-profile.usecase';
import { GetUserByEmailUsecase } from './service/usecase/get-user-by-email.usecase';
import { UsecaseHandler } from '../usecase-handler.service';
import { CreateTherapistTypeUsecase } from './service/usecase/create-therapist-type.usecase';
import { TherapyManagementServiceModule } from '../therapy-management/therapy-management-service.module';
import { UpdateMemberProfileUsecase } from './service/usecase/update-member-profile.usecase';
import { UpdateTherapistProfileUsecase } from './service/usecase/update-therapist-profile.usecase';

const useCases = [
  CreateUserUsecase,
  GetUserByUsernameUsecase,
  GetUserByIdUsecase,
  CheckDuplicateUserUsecase,
  GenerateAccessTokenUsecase,
  RegisterUserUsecase,
  LoginUserUsecase,
  GetAllUsersUsecase,
  CountTotalUsersUsecase,
  CreateMemberProfileUsecase,
  ChangeRoleUsecase,
  CreateTherapistProfileUsecase,
  GetUserByEmailUsecase,
  CreateTherapistTypeUsecase,
  UpdateMemberProfileUsecase,
  UpdateTherapistProfileUsecase,
];

@Module({
  imports: [PersistenceModule, SecurityModule, TherapyManagementServiceModule],
  providers: [
    {
      provide: 'IUsersService',
      useClass: UsersService,
    },
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    // {
    //   provide: UsecaseHandler,
    //   useFactory: (...useCases: UseCase<any, any>[]) =>
    //     new UsecaseHandler(useCases),
    //   inject: useCases,
    // },
    UsecaseHandler,
    ...useCases,
  ],
  exports: ['IUsersService', 'IAuthService', UsecaseHandler],
})
export class UserServiceModule {}
