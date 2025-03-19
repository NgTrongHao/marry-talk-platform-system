import { UseCase } from '../../../usecase.interface';
import { FlaggingReport } from '../../../../core/domain/entity/flagging-report.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FlaggingReportRepository } from '../../../../core/domain/repository/flagging-report.repository';
import { RequestStatus } from '../../../../core/domain/entity/enum/request-status.enum';

@Injectable()
export class ApproveSessionReportUsecase
  implements UseCase<string, FlaggingReport>
{
  constructor(
    @Inject('FlaggingReportRepository')
    private flaggingReportRepository: FlaggingReportRepository,
  ) {}

  async execute(reportId: string): Promise<FlaggingReport> {
    const report = await this.flaggingReportRepository.findById(reportId);
    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.status = RequestStatus.APPROVED;

    return await this.flaggingReportRepository.save(report);
  }
}
