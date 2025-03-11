import {
  ServicePackage as PrismaServicePackage,
  TherapistService as PrismaTherapistService,
} from '@prisma/client';
import { ServicePackage } from '../../../../core/domain/entity/service-package.entity';
import { TherapistService } from '../../../../core/domain/entity/therapist-service.entity';

export class PrismaServicePackageMapper {
  static toDomain(entity: PrismaServicePackage) {
    return ServicePackage.build({
      id: entity.package_id,
      name: entity.title,
      sessionCount: entity.sessions,
    });
  }

  static toTherapistServiceDomain(
    entity: PrismaTherapistService & { package: PrismaServicePackage },
  ) {
    return TherapistService.build({
      id: entity.therapist_service_id,
      therapistId: entity.therapist_id,
      therapyCategoryId: entity.therapy_id,
      price: entity.price.toNumber(),
      currency: entity.currency,
      description: entity.description,
      package: this.toDomain(entity.package),
    });
  }
}
