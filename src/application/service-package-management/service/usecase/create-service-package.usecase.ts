import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { ServicePackage } from '../../../../core/domain/entity/service-package.entity';
import { ServicePackageRepository } from '../../../../core/domain/repository/service-package.repository';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { CheckExistServicePackageUsecase } from './check-exist-service-package.usecase';

export interface CreateServicePackageUsecaseCommand {
  name: string;
  sessions: number;
}

@Injectable()
export class CreateServicePackageUsecase
  implements UseCase<CreateServicePackageUsecaseCommand, ServicePackage>
{
  constructor(
    @Inject('ServicePackageRepository')
    private servicePackageRepository: ServicePackageRepository,
    private useCaseHandler: UsecaseHandler,
  ) {}

  async execute(
    command: CreateServicePackageUsecaseCommand,
  ): Promise<ServicePackage> {
    const isExist = await this.useCaseHandler.execute(
      CheckExistServicePackageUsecase,
      { name: command.name, sessions: command.sessions },
    );

    if (isExist) {
      throw new BadRequestException('Service package already exists');
    }

    const servicePackage = ServicePackage.create({
      name: command.name,
      sessionCount: command.sessions,
    });

    return await this.servicePackageRepository.save(servicePackage);
  }
}
