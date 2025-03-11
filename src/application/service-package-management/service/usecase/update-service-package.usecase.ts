import { UseCase } from '../../../usecase.interface';
import { ServicePackage } from '../../../../core/domain/entity/service-package.entity';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { ServicePackageRepository } from '../../../../core/domain/repository/service-package.repository';

export interface UpdateServicePackageUsecaseCommand {
  id: string;
  name?: string;
  sessionCount?: number;
}

export class UpdateServicePackageUsecase
  implements UseCase<UpdateServicePackageUsecaseCommand, ServicePackage>
{
  constructor(
    @Inject('ServicePackageRepository')
    private servicePackageRepository: ServicePackageRepository,
  ) {}

  async execute(
    command: UpdateServicePackageUsecaseCommand,
  ): Promise<ServicePackage> {
    const servicePackage = await this.servicePackageRepository.findById(
      command.id,
    );

    if (!servicePackage) {
      throw new NotFoundException('Service package not found');
    }

    const isExist =
      await this.servicePackageRepository.checkExistServicePackage({
        name: command.name,
        sessions: command.sessionCount,
        excludeId: command.id,
      });

    if (isExist) {
      throw new BadRequestException(
        'Service package with same name or session count already exists',
      );
    }

    if (command.name) {
      servicePackage.name = command.name;
    }

    if (command.sessionCount) {
      servicePackage.sessionCount = command.sessionCount;
    }

    return this.servicePackageRepository.save(servicePackage);
  }
}
