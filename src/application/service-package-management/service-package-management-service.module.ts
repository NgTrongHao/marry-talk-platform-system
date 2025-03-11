import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { UsecaseHandler } from '../usecase-handler.service';
import { ServicePackageManagementService } from './service/service-package-management.service';
import { CreateServicePackageUsecase } from './service/usecase/create-service-package.usecase';
import { GetAllServicePackagesUsecase } from './service/usecase/get-all-service-packages.usecase';
import { UpdateServicePackageUsecase } from './service/usecase/update-service-package.usecase';
import { TherapyManagementServiceModule } from '../therapy-management/therapy-management-service.module';
import { SetTherapistServicesWithTherapyUsecase } from './service/usecase/set-therapist-services-with-therapy.usecase';
import { CheckExistServicePackageUsecase } from './service/usecase/check-exist-service-package.usecase';
import { GetTherapistServicesUsecase } from './service/usecase/get-therapist-services.usecase';

const useCases = [
  CreateServicePackageUsecase,
  GetAllServicePackagesUsecase,
  UpdateServicePackageUsecase,
  SetTherapistServicesWithTherapyUsecase,
  CheckExistServicePackageUsecase,
  GetTherapistServicesUsecase,
];

@Module({
  imports: [PersistenceModule, TherapyManagementServiceModule],
  providers: [
    {
      provide: 'IServicePackageManagementService',
      useClass: ServicePackageManagementService,
    },
    UsecaseHandler,
    ...useCases,
  ],
  exports: [UsecaseHandler, 'IServicePackageManagementService'],
})
export class ServicePackageManagementServiceModule {}
