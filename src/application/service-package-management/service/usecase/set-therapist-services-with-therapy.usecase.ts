import { UseCase } from '../../../usecase.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ServicePackageRepository } from '../../../../core/domain/repository/service-package.repository';
import { TherapistService } from '../../../../core/domain/entity/therapist-service.entity';

export interface SetTherapistServicesWithTherapyUsecaseCommand {
  therapistId: string;
  therapyId: string;
  therapistServices: {
    price: number;
    servicePackageId: string;
    currency: string;
    description: string;
    timeInMinutes: number;
  }[];
}

@Injectable()
export class SetTherapistServicesWithTherapyUsecase
  implements
    UseCase<SetTherapistServicesWithTherapyUsecaseCommand, TherapistService[]>
{
  constructor(
    @Inject('ServicePackageRepository')
    private servicePackageRepository: ServicePackageRepository,
  ) {}

  async execute(
    command: SetTherapistServicesWithTherapyUsecaseCommand,
  ): Promise<TherapistService[]> {
    const therapistServices: TherapistService[] = [];

    for (const service of command.therapistServices) {
      const servicePackage = await this.servicePackageRepository.findById(
        service.servicePackageId,
      );

      if (!servicePackage) {
        throw new NotFoundException('Service package not found');
      }

      therapistServices.push(
        TherapistService.create({
          therapistId: command.therapistId,
          therapyCategoryId: command.therapyId,
          package: servicePackage,
          price: service.price,
          currency: service.currency,
          timeInMinutes: service.timeInMinutes,
          description: service.description,
        }),
      );
    }

    return await Promise.all(
      therapistServices.map((service) => {
        return this.servicePackageRepository.saveTherapistService(service);
      }),
    );
  }
}
