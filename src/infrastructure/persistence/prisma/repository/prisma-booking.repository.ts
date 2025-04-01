import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';
import { Booking } from '../../../../core/domain/entity/booking.entity';
import { PrismaService } from '../prisma.service';
import { PrismaBookingMapper } from '../mapper/prisma-booking-mapper';
import { ProgressStatus, RequestStatus } from '@prisma/client';

@Injectable()
export class PrismaBookingRepository implements BookingRepository {
  constructor(private prisma: PrismaService) {}

  async save(booking: Booking): Promise<Booking> {
    const result = await this.prisma.booking.upsert({
      where: { booking_id: booking.id },
      update: {
        status: booking.progressStatus!,
        rating: booking.rating,
        expires_at: booking.expiresAt!,
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

  async getTherapistBookings(
    therapistId: string,
    page: number,
    limit: number,
    status: string | undefined,
    from: Date | undefined,
    to: Date | undefined,
  ): Promise<Booking[]> {
    return this.prisma.booking
      .findMany({
        where: {
          therapist_id: therapistId,
          ...(status ? { status: status as ProgressStatus } : {}),
          ...(from && to ? { created_at: { gte: from, lte: to } } : {}),
        },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          therapistService: {
            include: {
              package: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      })
      .then((bookings) =>
        bookings.map((booking) => PrismaBookingMapper.toDomain(booking)),
      );
  }

  async getUserBookings(
    userId: string,
    page: number,
    limit: number,
    status: string | undefined,
    from: Date | undefined,
    to: Date | undefined,
  ): Promise<Booking[]> {
    return this.prisma.booking
      .findMany({
        where: {
          user_id: userId,
          ...(status ? { status: status as ProgressStatus } : {}),
          ...(from && to ? { created_at: { gte: from, lte: to } } : {}),
        },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          therapistService: {
            include: {
              package: true,
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      })
      .then((bookings) =>
        bookings.map((booking) => PrismaBookingMapper.toDomain(booking)),
      );
  }

  countTherapistBookings(
    therapistId: string,
    status: string | undefined,
    from: Date | undefined,
    to: Date | undefined,
  ): Promise<number> {
    console.info('status', status);
    return this.prisma.booking.count({
      where: {
        therapist_id: therapistId,
        ...(status ? { status: status as ProgressStatus } : {}),
        ...(from && to ? { created_at: { gte: from, lte: to } } : {}),
      },
    });
  }

  countUserBookings(
    userId: string,
    status: string | undefined,
    from: Date | undefined,
    to: Date | undefined,
  ): Promise<number> {
    return this.prisma.booking.count({
      where: {
        user_id: userId,
        ...(status ? { status: status as ProgressStatus } : {}),
        ...(from && to ? { created_at: { gte: from, lte: to } } : {}),
      },
    });
  }

  async findAllExpiredPendingBookings(): Promise<Booking[]> {
    return this.prisma.booking
      .findMany({
        where: {
          status: ProgressStatus.PENDING,
          expires_at: {
            lt: new Date(),
          },
        },
        include: {
          therapistService: {
            include: {
              package: true,
            },
          },
        },
      })
      .then((bookings) =>
        bookings.map((booking) => PrismaBookingMapper.toDomain(booking)),
      );
  }

  async getReportedBookings(
    userId: string,
    page: number,
    limit: number,
  ): Promise<Booking[]> {
    return this.prisma.booking
      .findMany({
        where: {
          therapist_id: userId,
          session: {
            some: {
              report: {
                some: {
                  status: RequestStatus.APPROVED,
                },
              },
            },
          },
        },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          therapistService: {
            include: {
              package: true,
            },
          },
        },
        orderBy: {
          updated_at: 'desc',
        },
      })
      .then((bookings) =>
        bookings.map((booking) => PrismaBookingMapper.toDomain(booking)),
      );
  }

  countTherapistReportedBookings(therapistId: string): Promise<number> {
    return this.prisma.booking.count({
      where: {
        therapist_id: therapistId,
        session: {
          some: {
            report: {
              some: {
                status: RequestStatus.APPROVED,
              },
            },
          },
        },
      },
    });
  }
}
