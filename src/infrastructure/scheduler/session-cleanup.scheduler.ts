import { Inject, Injectable } from '@nestjs/common';
import { IBookingService } from '../../application/booking/booking-service.interface';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SessionCleanupScheduler {
  constructor(
    @Inject('IBookingService') private readonly bookingService: IBookingService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async cleanupSessions() {
    await this.bookingService.cleanupExpiredPendingSessionBookings();
  }
}
