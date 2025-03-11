import { UseCase } from '../../../usecase.interface';
import { TherapistService } from '../../../../core/domain/entity/therapist-service.entity';
import { Inject, Injectable } from '@nestjs/common';
import { ServicePackageRepository } from '../../../../core/domain/repository/service-package.repository';

export interface GetTherapistServicesUsecaseCommand {
  therapistId: string;
  therapyId?: string;
  sessions?: number;
  servicePackageId?: string;
}

@Injectable()
export class GetTherapistServicesUsecase
  implements UseCase<GetTherapistServicesUsecaseCommand, TherapistService[]>
{
  constructor(
    @Inject('ServicePackageRepository')
    private servicePackageRepository: ServicePackageRepository,
  ) {}

  async execute(
    command: GetTherapistServicesUsecaseCommand,
  ): Promise<TherapistService[]> {
    const services =
      await this.servicePackageRepository.getTherapistServices(command);
    console.info('services', services);
    return services;
  }
}
