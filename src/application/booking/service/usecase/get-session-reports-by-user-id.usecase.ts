import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { FlaggingReport } from '../../../../core/domain/entity/flagging-report.entity';
import { FlaggingReportRepository } from '../../../../core/domain/repository/flagging-report.repository';

interface GetSessionReportsByUserIdUsecaseCommand {
  userId: string;
  page: number;
  limit: number;
  status?: string;
}

@Injectable()
export class GetSessionReportsByUserIdUsecase
  implements UseCase<GetSessionReportsByUserIdUsecaseCommand, FlaggingReport[]>
{
  constructor(
    @Inject('FlaggingReportRepository')
    private flaggingReportRepository: FlaggingReportRepository,
  ) {}

  async execute(
    command: GetSessionReportsByUserIdUsecaseCommand,
  ): Promise<FlaggingReport[]> {
    const reports = await this.flaggingReportRepository.getAllSessionReports(
      command.page,
      command.limit,
      command.status,
    );

    return reports.filter((report) => report.reportBy === command.userId);
  }
}
