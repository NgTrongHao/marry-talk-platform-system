import { Inject, Injectable, Logger } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';

@Injectable()
export class CleanupExpiredSessionsUsecase implements UseCase<void, void> {
  private readonly logger = new Logger(CleanupExpiredSessionsUsecase.name);

  constructor(
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
    @Inject('BookingRepository')
    private bookingRepository: BookingRepository,
  ) {}

  async execute(): Promise<void> {
    this.logger.log('Cleaning up expired sessions');

    const bookings =
      await this.bookingRepository.findAllExpiredPendingBookings();

    if (bookings.length === 0) {
      this.logger.log('No expired sessions to clean up');
      return;
    }

    for (const booking of bookings) {
      const sessions = (
        await this.sessionRepository.getSessionsByBookingId(booking.id!)
      ).map((s) => s.id!);

      if (sessions.length > 0) {
        await this.sessionRepository.deleteSessions(sessions);
        this.logger.log(
          'Cleaning up expired sessions for booking ' + booking.id,
        );
      }

      booking.progressStatus = ProgressStatus.CANCELLED;
      await this.bookingRepository.save(booking);
    }

    this.logger.log('Expired sessions cleaned up');

    return;
  }
}
