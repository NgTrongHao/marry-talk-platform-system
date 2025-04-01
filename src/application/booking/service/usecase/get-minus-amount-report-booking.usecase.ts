import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';

@Injectable()
export class GetMinusAmountReportBookingUsecase
  implements UseCase<string, number>
{
  constructor(
    @Inject('BookingRepository') private bookingRepository: BookingRepository,
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
  ) {}

  async execute(bookingId: string): Promise<number> {
    const booking = await this.bookingRepository.findBookingById(bookingId);

    if (!booking) {
      throw new BadRequestException('Booking not found');
    }

    const allSessions =
      await this.sessionRepository.getSessionsByBookingId(bookingId);

    const completedSessions = allSessions.filter(
      (session) => session.progressStatus === ProgressStatus.COMPLETED,
    );

    const totalSessions = booking.therapistService?.package.sessionCount;
    const completedSessionsCount = completedSessions.length;
    const uncompletedSessionsCount = totalSessions! - completedSessionsCount;

    if (uncompletedSessionsCount === 0) {
      return 0;
    }

    const totalPrice = booking.therapistService?.price;
    const sessionPrice = totalPrice! / totalSessions!;

    return sessionPrice * uncompletedSessionsCount * 0.8;
  }
}
