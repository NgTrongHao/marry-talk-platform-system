import { Module } from '@nestjs/common';
import { UserServiceModule } from '../application/user/user-service.module';
import { AuthController } from './api/authentication/auth.controller';
import { UserController } from './api/user/user.controller';
import { SecurityModule } from '../infrastructure/security/security.module';
import { JwtAuthGuard } from '../infrastructure/security/guard/jwt-auth.guard';
import { RoleAuthoriseGuard } from '../infrastructure/security/guard/role-authorise.guard';
import { FirebaseModule } from '../infrastructure/external/firebase/firebase.module';
import { FileUploadController } from './api/file/file-upload.controller';
import { TherapyManagementServiceModule } from '../application/therapy-management/therapy-management-service.module';
import { TherapyController } from './api/therapy/therapy.controller';
import { TherapistManagementServiceModule } from '../application/therapist-management/therapist-management-service.module';
import { TherapistManagementController } from './api/therapist/therapist-management.controller';
import { PreMaritalTestSubmissionController } from './api/pre-marital-test/pre-marital-test-submission.controller';
import { PreMaritalTestServiceModule } from '../application/premarital-test/pre-marital-test-service.module';
import { ServicePackageManagementServiceModule } from '../application/service-package-management/service-package-management-service.module';
import { ServicePackageController } from './api/service-package/service-package.controller';
import { BookingServiceModule } from '../application/booking/booking-service.module';
import { BookingController } from './api/booking/booking.controller';
import { PaymentModule } from '../infrastructure/external/payment/payment.module';
import { SessionController } from './api/booking/session.controller';
import { VnpayModule } from '../infrastructure/external/payment/vnPay/modules/vnpay.module';
import { PayoutServiceModule } from '../application/payout/payout-service.module';
import { PayoutWithdrawController } from './api/payout/payout-withdraw.controller';
import { PreMaritalTestAnswerController } from './api/pre-marital-test/pre-marital-test-answer.controller';
import { PreMaritalTestManagementController } from './api/pre-marital-test/pre-marital-test-management.controller';
import { PreMaritalTestQuestionController } from './api/pre-marital-test/pre-marital-test-question.controller';
import { TherapistApprovalController } from './api/therapist/therapist-approval.controller';
import { TherapistWorkingHoursController } from './api/therapist/therapist-working-hours.controller';
import { SessionReportController } from './api/booking/session-report.controller';
import { PayoutRefundController } from './api/payout/payout-refund.controller';
import { BlogModule } from '../infrastructure/external/blog/blog.module';
import { BlogController } from './api/blog/blog.controller';
import { AdministrationController } from './api/administration/administration.controller';
import { AdministrationServiceModule } from '../application/administration/administration-service.module';
import { PayoutAccountController } from './api/payout/payout-account.controller';

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
    VnpayModule,
    PayoutServiceModule,
    BlogModule,
    AdministrationServiceModule,
  ],
  providers: [JwtAuthGuard, RoleAuthoriseGuard],
  controllers: [
    AuthController,
    UserController,
    FileUploadController,
    TherapyController,
    TherapistManagementController,
    PreMaritalTestSubmissionController,
    ServicePackageController,
    BookingController,
    SessionController,
    PayoutWithdrawController,
    PreMaritalTestAnswerController,
    PreMaritalTestManagementController,
    PreMaritalTestQuestionController,
    TherapistApprovalController,
    TherapistWorkingHoursController,
    SessionReportController,
    PayoutRefundController,
    BlogController,
    AdministrationController,
    PayoutAccountController,
  ],
})
export class AdapterModule {}
