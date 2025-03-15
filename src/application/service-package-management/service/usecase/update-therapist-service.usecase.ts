import { UseCase } from '../../../usecase.interface';
import { TherapistService } from '../../../../core/domain/entity/therapist-service.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ServicePackageRepository } from '../../../../core/domain/repository/service-package.repository';

export interface UpdateTherapistServiceUsecaseCommand {
  therapistServiceId: string;
  price?: number;
  currency?: string;
  timeInMinutes?: number;
  description?: string;
}

@Injectable()
export class UpdateTherapistServiceUsecase
  implements UseCase<UpdateTherapistServiceUsecaseCommand, TherapistService>
{
  constructor(
    @Inject('ServicePackageRepository')
    private servicePackageRepository: ServicePackageRepository,
  ) {}

  async execute(
    command: UpdateTherapistServiceUsecaseCommand,
  ): Promise<TherapistService> {
    const therapistService =
      await this.servicePackageRepository.findTherapistServiceById(
        command.therapistServiceId,
      );

    if (!therapistService) {
      throw new NotFoundException('Therapist service not found');
    }

    if (command.price) {
      therapistService.price = command.price;
    }

    if (command.currency) {
      therapistService.currency = command.currency;
    }

    if (command.timeInMinutes) {
      therapistService.timeInMinutes = command.timeInMinutes;
    }

    if (command.description) {
      therapistService.description = command.description;
    }

    return await this.servicePackageRepository.saveTherapistService(
      therapistService,
    );
  }
}
