import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { TherapistService } from '../../../../core/domain/entity/therapist-service.entity';
import { ServicePackageRepository } from '../../../../core/domain/repository/service-package.repository';

@Injectable()
export class GetTherapistServiceByIdUsecase
  implements UseCase<string, TherapistService>
{
  constructor(
    @Inject('ServicePackageRepository')
    private servicePackageRepository: ServicePackageRepository,
  ) {}

  async execute(therapistServiceId: string): Promise<TherapistService> {
    const service =
      await this.servicePackageRepository.getTherapistServiceById(
        therapistServiceId,
      );

    if (!service) {
      throw new NotFoundException('Therapist service not found');
    }

    return service;
  }
}
