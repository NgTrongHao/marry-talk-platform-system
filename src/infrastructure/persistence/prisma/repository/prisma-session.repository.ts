import { SessionRepository } from '../../../../core/domain/repository/session.repository';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { Session } from '../../../../core/domain/entity/session.entity';
import { PrismaSessionMapper } from '../mapper/prisma-session-mapper';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private prisma: PrismaService) {}

  async getSessionsByBookingId(bookingId: string): Promise<Session[]> {
    const sessions = await this.prisma.session.findMany({
      where: { booking_id: bookingId },
      include: {
        booking: {
          include: {
            therapistService: {
              include: {
                package: true,
              },
            },
          },
        },
      },
    });
    return sessions.map((session) => {
      return PrismaSessionMapper.toDomain(session);
    });
  }

  async save(session: Session): Promise<Session> {
    const savedSession = await this.prisma.session.upsert({
      where: { session_id: session.id },
      update: {
        status: session.progressStatus,
        session_date: session.sessionDate,
        start_time: session.startTime,
        end_time: session.endTime,
        reported: session.reported,
      },
      create: {
        session_id: session.id,
        booking: {
          connect: {
            booking_id: session.booking.id,
          },
        },
        therapist: session.booking.therapistId
          ? { connect: { user_id: session.booking.therapistId } }
          : undefined,
        status: session.progressStatus,
        session_date: session.sessionDate,
        session_number: session.sessionNumber,
        meeting_link: session.meetingUrl,
        start_time: session.startTime,
        end_time: session.endTime,
        reported: session.reported,
      },
      include: {
        booking: {
          include: {
            therapistService: {
              include: {
                package: true,
              },
            },
          },
        },
      },
    });
    return PrismaSessionMapper.toDomain(savedSession);
  }

  async findByTherapistAndDate(
    therapistId: string,
    sessionDate: Date,
  ): Promise<Session[]> {
    const startOfDay = new Date(sessionDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(sessionDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const sessions = await this.prisma.session.findMany({
      where: {
        therapist_id: therapistId,
        session_date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        booking: {
          include: {
            therapistService: {
              include: {
                package: true,
              },
            },
          },
        },
      },
    });

    return sessions.map((session) => PrismaSessionMapper.toDomain(session));
  }

  async findSessionById(sessionId: string): Promise<Session | null> {
    const result = await this.prisma.session.findUnique({
      where: { session_id: sessionId },
      include: {
        booking: {
          include: {
            therapistService: {
              include: {
                package: true,
              },
            },
          },
        },
      },
    });
    if (result) {
      return PrismaSessionMapper.toDomain(result);
    }
    return null;
  }

  async getTherapySessionByUserId(
    userId: string,
    page: number,
    limit: number,
    date: Date | undefined,
    status: ProgressStatus | undefined,
  ): Promise<Session[]> {
    return this.prisma.session
      .findMany({
        where: {
          booking: {
            user_id: userId,
          },
          ...(date ? { session_date: date } : {}),
          ...(status ? { status: status } : {}),
        },
        take: limit,
        skip: (page - 1) * limit,
        include: {
          booking: {
            include: {
              therapistService: {
                include: {
                  package: true,
                },
              },
            },
          },
        },
        orderBy: {
          session_date: 'desc',
        },
      })
      .then((results) =>
        results.map((session) => PrismaSessionMapper.toDomain(session)),
      );
  }

  async countTherapySessionByUserId(
    userId: string,
    date: Date | undefined,
    status: ProgressStatus | undefined,
  ): Promise<number> {
    return this.prisma.session.count({
      where: {
        user_id: userId,
        session_date: date,
        status: status,
      },
    });
  }
}
