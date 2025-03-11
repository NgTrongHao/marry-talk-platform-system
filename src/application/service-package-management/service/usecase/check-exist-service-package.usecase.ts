import { UseCase } from '../../../usecase.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ServicePackageRepository } from '../../../../core/domain/repository/service-package.repository';

export interface CheckExistServicePackageUsecaseCommand {
  name?: string;
  sessions?: number;
}

@Injectable()
export class CheckExistServicePackageUsecase
  implements UseCase<CheckExistServicePackageUsecaseCommand, boolean>
{
  constructor(
    @Inject('ServicePackageRepository')
    private servicePackageRepository: ServicePackageRepository,
  ) {}

  async execute(
    command: CheckExistServicePackageUsecaseCommand,
  ): Promise<boolean> {
    return await this.servicePackageRepository.checkExistServicePackage(
      command,
    );
  }
}
