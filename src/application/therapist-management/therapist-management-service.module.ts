import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { UsecaseHandler } from '../usecase-handler.service';
import { TherapistManagementService } from './service/therapist-management.service';
import { ApproveTherapistTypeUsecase } from './service/usecase/approve-therapist-type.usecase';
import { ApproveToBeTherapistUsecase } from './service/usecase/approve-to-be-therapist.usecase';
import { TherapyManagementServiceModule } from '../therapy-management/therapy-management-service.module';
import { CountTherapistHasTherapyIdUsecase } from './service/usecase/count-therapist-has-therapy-id.usecase';
import { FindTherapistsByTherapyIdUsecase } from './service/usecase/find-therapists-by-therapy-id.usecase';
import { PutTherapistWorkScheduleUsecase } from './service/usecase/put-therapist-work-schedule.usecase';
import { GetTherapistWorkScheduleUsecase } from './service/usecase/get-therapist-work-schedule.usecase';
import { FindApprovedTherapistUsecase } from './service/usecase/find-approved-therapist.usecase';
import { CountApprovedTherapistUsecase } from './service/usecase/count-approved-therapist.usecase';
import { FindUnapprovedTherapistUsecase } from './service/usecase/find-unapproved-therapist.usecase';
import { CountUnapprovedTherapistUsecase } from './service/usecase/count-unapproved-therapist.usecase';
import { GetTherapistBalanceUsecase } from './service/usecase/get-therapist-balance.usecase';

const useCases = [
  ApproveTherapistTypeUsecase,
  ApproveToBeTherapistUsecase,
  CountTherapistHasTherapyIdUsecase,
  FindTherapistsByTherapyIdUsecase,
  PutTherapistWorkScheduleUsecase,
  GetTherapistWorkScheduleUsecase,
  FindApprovedTherapistUsecase,
  CountApprovedTherapistUsecase,
  FindUnapprovedTherapistUsecase,
  CountUnapprovedTherapistUsecase,
  GetTherapistBalanceUsecase,
];

@Module({
  imports: [PersistenceModule, TherapyManagementServiceModule],
  providers: [
    {
      provide: 'ITherapistManagementService',
      useClass: TherapistManagementService,
    },
    UsecaseHandler,
    ...useCases,
  ],
  exports: [UsecaseHandler, 'ITherapistManagementService'],
})
export class TherapistManagementServiceModule {}
