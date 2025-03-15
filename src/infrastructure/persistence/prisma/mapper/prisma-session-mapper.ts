import {
  Booking as PrismaBooking,
  Session as PrismaSession,
} from '@prisma/client';
import { Session } from '../../../../core/domain/entity/session.entity';
import { PrismaBookingMapper } from './prisma-booking-mapper';
import {
  ServicePackage as PrismaServicePackage,
  TherapistService as PrismaTherapistService,
} from '.prisma/client';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';

export class PrismaSessionMapper {
  static toDomain(
    entity: PrismaSession & {
      booking: PrismaBooking & {
        therapistService: PrismaTherapistService & {
          package: PrismaServicePackage;
        };
      };
    },
  ): Session {
    return Session.build({
      id: entity.session_id,
      booking: PrismaBookingMapper.toDomain(entity.booking),
      sessionDate: entity.session_date,
      sessionNumber: entity.session_number,
      progressStatus: entity.status as ProgressStatus,
      meetingUrl: entity.meeting_link,
      startTime: entity.start_time,
      endTime: entity.end_time,
    });
  }
}
