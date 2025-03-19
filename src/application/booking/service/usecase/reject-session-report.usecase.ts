import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { FlaggingReport } from '../../../../core/domain/entity/flagging-report.entity';
import { FlaggingReportRepository } from '../../../../core/domain/repository/flagging-report.repository';
import { RequestStatus } from '../../../../core/domain/entity/enum/request-status.enum';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';

@Injectable()
export class RejectSessionReportUsecase
  implements UseCase<string, FlaggingReport>
{
  constructor(
    @Inject('FlaggingReportRepository')
    private flaggingReportRepository: FlaggingReportRepository,
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
  ) {}

  async execute(reportId: string): Promise<FlaggingReport> {
    const report = await this.flaggingReportRepository.findById(reportId);
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.status = RequestStatus.REJECTED;

    const session = await this.sessionRepository.findSessionById(
      report.reportReferralId,
    );

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    session.reported = false;

    await this.sessionRepository.save(session);

    return await this.flaggingReportRepository.save(report);
  }
}
