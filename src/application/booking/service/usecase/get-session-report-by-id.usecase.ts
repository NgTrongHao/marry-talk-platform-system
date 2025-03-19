import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { FlaggingReport } from '../../../../core/domain/entity/flagging-report.entity';
import { FlaggingReportRepository } from '../../../../core/domain/repository/flagging-report.repository';

@Injectable()
export class GetSessionReportByIdUsecase
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

    return report;
  }
}
