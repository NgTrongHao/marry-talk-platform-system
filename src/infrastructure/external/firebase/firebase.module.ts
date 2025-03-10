import { Module } from '@nestjs/common';
import { UserServiceModule } from '../../../application/user/user-service.module';
import { CheckExistedUserUsecase } from './service/usecase/check-existed-user.usecase';
import { FirebaseVerifyIdTokenUsecase } from './service/usecase/firebase-verify-id-token.usecase';
import { FirebaseLoginUsecase } from './service/usecase/firebase-login.usecase';
import { FirebaseService } from './service/firebase.service';
import { FirebaseAuthRepository } from './repository/firebase-auth.repository';
import { FirebaseStorageRepository } from './repository/firebase-storage.repository';
import { FirebaseUploadUsecase } from './service/usecase/firebase-upload.usecase';

@Module({
  imports: [UserServiceModule],
  providers: [
    {
      provide: 'IFirebaseService',
      useClass: FirebaseService,
    },
    FirebaseAuthRepository,
    FirebaseStorageRepository,
    CheckExistedUserUsecase,
    FirebaseVerifyIdTokenUsecase,
    FirebaseLoginUsecase,
    FirebaseUploadUsecase,
  ],
  exports: ['IFirebaseService'],
})
export class FirebaseModule {}
