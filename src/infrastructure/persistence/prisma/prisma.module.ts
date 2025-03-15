import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PrismaUserRepository } from './repository/prisma-user.repository';
import { PrismaMemberRepository } from './repository/prisma-member.repository';
import { PrismaTherapistRepository } from './repository/prisma-therapist.repository';
import { PrismaTherapyCategoryRepository } from './repository/prisma-therapy-category.repository';
import { PrismaPreMaritalTestRepository } from './repository/prisma-pre-marital-test.repository';
import { PrismaQuestionRepository } from './repository/prisma-question.repository';
import { PrismaServicePackageRepository } from './repository/prisma-service-package.repository';
import { PrismaBookingRepository } from './repository/prisma-booking.repository';
import { PrismaPaymentTransactionRepository } from './repository/prisma-payment-transaction.repository';
import { PrismaSessionRepository } from './repository/prisma-session.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: 'UserRepository',
      useClass: PrismaUserRepository,
    },
    {
      provide: 'MemberRepository',
      useClass: PrismaMemberRepository,
    },
    {
      provide: 'TherapistRepository',
      useClass: PrismaTherapistRepository,
    },
    {
      provide: 'TherapyCategoryRepository',
      useClass: PrismaTherapyCategoryRepository,
    },
    {
      provide: 'PremaritalTestRepository',
      useClass: PrismaPreMaritalTestRepository,
    },
    {
      provide: 'QuestionRepository',
      useClass: PrismaQuestionRepository,
    },
    {
      provide: 'ServicePackageRepository',
      useClass: PrismaServicePackageRepository,
    },
    {
      provide: 'BookingRepository',
      useClass: PrismaBookingRepository,
    },
    {
      provide: 'PaymentTransactionRepository',
      useClass: PrismaPaymentTransactionRepository,
    },
    {
      provide: 'SessionRepository',
      useClass: PrismaSessionRepository,
    },
  ],
  exports: [
    PrismaService,
    'UserRepository',
    'MemberRepository',
    'TherapistRepository',
    'TherapyCategoryRepository',
    'PremaritalTestRepository',
    'QuestionRepository',
    'ServicePackageRepository',
    'BookingRepository',
    'PaymentTransactionRepository',
    'SessionRepository',
  ],
})
export class PrismaModule {}
