import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { UsecaseHandler } from '../usecase-handler.service';
import { AdministrationService } from './service/administration.service';
import { GetFinancialReportUsecase } from './service/usecase/get-financial-report.usecase';
import { GetTotalUsersUsecase } from './service/usecase/get-total-users.usecase';

const useCases = [GetFinancialReportUsecase, GetTotalUsersUsecase];

@Module({
  imports: [PersistenceModule],
  providers: [
    {
      provide: 'IAdministrationService',
      useClass: AdministrationService,
    },
    UsecaseHandler,
    ...useCases,
  ],
  exports: [UsecaseHandler, 'IAdministrationService'],
})
export class AdministrationServiceModule {}
