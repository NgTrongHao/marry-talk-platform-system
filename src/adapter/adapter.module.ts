import { Module } from '@nestjs/common';
import { UserServiceModule } from '../application/user/user-service.module';
import { AuthController } from './api/auth.controller';
import { UserController } from './api/user.controller';
import { SecurityModule } from '../infrastructure/security/security.module';
import { JwtAuthGuard } from '../infrastructure/security/guard/jwt-auth.guard';
import { RoleAuthoriseGuard } from '../infrastructure/security/guard/role-authorise.guard';
import { FirebaseModule } from '../infrastructure/external/firebase/firebase.module';
import { FileUploadController } from './api/file-upload.controller';
import { TherapyManagementServiceModule } from '../application/therapy-management/therapy-management-service.module';
import { TherapyController } from './api/therapy.controller';
import { TherapistManagementServiceModule } from '../application/therapist-management/therapist-management-service.module';
import { TherapistController } from './api/therapist.controller';
import { PreMaritalTestController } from './api/pre-marital-test.controller';
import { PreMaritalTestServiceModule } from '../application/premarital-test/pre-marital-test-service.module';

@Module({
  imports: [
    SecurityModule,
    UserServiceModule,
    FirebaseModule,
    TherapyManagementServiceModule,
    TherapistManagementServiceModule,
    PreMaritalTestServiceModule,
  ],
  providers: [JwtAuthGuard, RoleAuthoriseGuard],
  controllers: [
    AuthController,
    UserController,
    FileUploadController,
    TherapyController,
    TherapistController,
    PreMaritalTestController,
  ],
})
export class AdapterModule {}
