import {
  Booking as PrismaBooking,
  ServicePackage as PrismaServicePackage,
  TherapistService as PrismaTherapistService,
} from '@prisma/client';
import { Booking } from '../../../../core/domain/entity/booking.entity';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';
import { PrismaServicePackageMapper } from './prisma-service-package-mapper';

export class PrismaBookingMapper {
  static toDomain(
    entity: PrismaBooking & {
      therapistService: PrismaTherapistService & {
        package: PrismaServicePackage;
      };
    },
  ): Booking {
    return Booking.build({
      id: entity.booking_id,
      therapistId: entity.therapist_id,
      userId: entity.user_id,
      servicePackageId: entity.package_id,
      therapyId: entity.therapy_id,
      therapistServiceId: entity.therapist_service_id,
      progressStatus: entity.status as ProgressStatus,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
      expiresAt: entity.expires_at,

      therapistService: PrismaServicePackageMapper.toTherapistServiceDomain(
        entity.therapistService,
      ),
    });
  }
}
