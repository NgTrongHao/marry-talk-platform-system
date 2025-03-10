import { Module } from '@nestjs/common';
import { PersistenceModule } from '../../infrastructure/persistence/persistence.module';
import { UsecaseHandler } from '../usecase-handler.service';
import { CreateTherapyCategoryUsecase } from './service/usecase/create-therapy-category.usecase';
import { TherapyManagementService } from './service/therapy-management.service';
import { GetTherapyCategoryByIdUsecase } from './service/usecase/get-therapy-category-by-id.usecase';
import { GetAllTherapyCategoryUsecase } from './service/usecase/get-all-therapy-category.usecase';
import { UpdateTherapyCategoryUsecase } from './service/usecase/update-therapy-category.usecase';

const useCases = [
  CreateTherapyCategoryUsecase,
  GetTherapyCategoryByIdUsecase,
  GetAllTherapyCategoryUsecase,
  UpdateTherapyCategoryUsecase,
];

@Module({
  imports: [PersistenceModule],
  providers: [
    {
      provide: 'ITherapyManagementService',
      useClass: TherapyManagementService,
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
  exports: [UsecaseHandler, 'ITherapyManagementService'],
})
export class TherapyManagementServiceModule {}
