import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule/dist/schedule.module';
import { BookingServiceModule } from '../../application/booking/booking-service.module';
import { SessionCleanupScheduler } from './session-cleanup.scheduler';

@Module({
  imports: [ScheduleModule.forRoot(), BookingServiceModule],
  providers: [SessionCleanupScheduler],
  exports: [],
})
export class SchedulerServiceModule {}
