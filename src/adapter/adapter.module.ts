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
import { ServicePackageManagementServiceModule } from '../application/service-package-management/service-package-management-service.module';
import { ServicePackageController } from './api/service-package.controller';
import { BookingServiceModule } from '../application/booking/booking-service.module';
import { BookingController } from './api/booking.controller';
import { PaymentController } from './api/payment.controller';
import { PaymentModule } from '../infrastructure/external/payment/payment.module';

@Module({
  imports: [
    SecurityModule,
    UserServiceModule,
    FirebaseModule,
    TherapyManagementServiceModule,
    TherapistManagementServiceModule,
    PreMaritalTestServiceModule,
    ServicePackageManagementServiceModule,
    BookingServiceModule,
    PaymentModule,
  ],
  providers: [JwtAuthGuard, RoleAuthoriseGuard],
  controllers: [
    AuthController,
    UserController,
    FileUploadController,
    TherapyController,
    TherapistController,
    PreMaritalTestController,
    ServicePackageController,
    BookingController,
    PaymentController,
  ],
})
export class AdapterModule {}
