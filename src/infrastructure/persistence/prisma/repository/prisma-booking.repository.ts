import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';
import { Booking } from '../../../../core/domain/entity/booking.entity';
import { PrismaService } from '../prisma.service';
import { PrismaBookingMapper } from '../mapper/prisma-booking-mapper';

@Injectable()
export class PrismaBookingRepository implements BookingRepository {
  constructor(private prisma: PrismaService) {}

  async save(booking: Booking): Promise<Booking> {
    const result = await this.prisma.booking.upsert({
      where: { booking_id: booking.id },
      update: {
        status: booking.progressStatus!,
      },
      create: {
        booking_id: booking.id,
        therapist_id: booking.therapistId,
        user_id: booking.userId,
        package_id: booking.servicePackageId,
        therapy_id: booking.therapyId,
        therapist_service_id: booking.therapistServiceId,
        status: booking.progressStatus!,
        created_at: booking.createdAt,
        updated_at: booking.updatedAt,
        expires_at: booking.expiresAt!,
      },
      include: {
        therapistService: {
          include: {
            package: true,
          },
        },
      },
    });
    return PrismaBookingMapper.toDomain(result);
  }

  async findBookingById(bookingId: string): Promise<Booking | null> {
    return this.prisma.booking
      .findUnique({
        where: { booking_id: bookingId },
        include: {
          therapistService: {
            include: {
              package: true,
            },
          },
        },
      })
      .then((result) => {
        if (result) {
          return PrismaBookingMapper.toDomain(result);
        }
        return null;
      });
  }
}
