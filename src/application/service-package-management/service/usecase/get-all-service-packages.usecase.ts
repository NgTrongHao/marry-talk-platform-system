import { UseCase } from '../../../usecase.interface';
import { ServicePackage } from '../../../../core/domain/entity/service-package.entity';
import { Inject, Injectable } from '@nestjs/common';
import { ServicePackageRepository } from '../../../../core/domain/repository/service-package.repository';

@Injectable()
export class GetAllServicePackagesUsecase
  implements UseCase<any, ServicePackage[]>
{
  constructor(
    @Inject('ServicePackageRepository')
    private servicePackageRepository: ServicePackageRepository,
  ) {}

  async execute(): Promise<ServicePackage[]> {
    return await this.servicePackageRepository.getAll();
  }
}
