import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { TherapistService } from '../../../../core/domain/entity/therapist-service.entity';
import { ServicePackageRepository } from '../../../../core/domain/repository/service-package.repository';

@Injectable()
export class DisableTherapistServiceUsecase
  implements UseCase<string, TherapistService>
{
  constructor(
    @Inject('ServicePackageRepository')
    private servicePackageRepository: ServicePackageRepository,
  ) {}

  async execute(serviceId: string) {
    const service =
      await this.servicePackageRepository.findTherapistServiceById(serviceId);
    if (!service) {
      throw new Error('Service not found');
    }

    service.enabled = false;
    return await this.servicePackageRepository.saveTherapistService(service);
  }
}
