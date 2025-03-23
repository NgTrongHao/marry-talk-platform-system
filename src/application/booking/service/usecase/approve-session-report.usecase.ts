import { UseCase } from '../../../usecase.interface';
import { FlaggingReport } from '../../../../core/domain/entity/flagging-report.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FlaggingReportRepository } from '../../../../core/domain/repository/flagging-report.repository';
import { RequestStatus } from '../../../../core/domain/entity/enum/request-status.enum';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';

@Injectable()
export class ApproveSessionReportUsecase
  implements UseCase<string, FlaggingReport>
{
  constructor(
    @Inject('FlaggingReportRepository')
    private flaggingReportRepository: FlaggingReportRepository,
    @Inject('BookingRepository') private bookingRepository: BookingRepository,
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
  ) {}

  async execute(reportId: string): Promise<FlaggingReport> {
    const report = await this.flaggingReportRepository.findById(reportId);
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const session = await this.sessionRepository.findSessionById(
      report.reportReferralId,
    );

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    session.reported = false;

    await this.sessionRepository.save(session);

    const booking = await this.bookingRepository.findBookingById(
      session.booking.id!,
    );

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    booking.progressStatus = ProgressStatus.CANCELLED;

    await this.bookingRepository.save(booking);

    report.status = RequestStatus.APPROVED;

    return await this.flaggingReportRepository.save(report);
  }
}
