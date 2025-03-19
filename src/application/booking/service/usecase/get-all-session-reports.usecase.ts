import { UseCase } from '../../../usecase.interface';
import { FlaggingReport } from '../../../../core/domain/entity/flagging-report.entity';
import { Inject, Injectable } from '@nestjs/common';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';
import { FlaggingReportRepository } from '../../../../core/domain/repository/flagging-report.repository';

interface GetAllSessionReportsUsecaseCommand {
  page: number;
  limit: number;
  status?: string;
}

@Injectable()
export class GetAllSessionReportsUsecase
  implements UseCase<GetAllSessionReportsUsecaseCommand, FlaggingReport[]>
{
  constructor(
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
    @Inject('FlaggingReportRepository')
    private flaggingReportRepository: FlaggingReportRepository,
  ) {}

  async execute(
    command: GetAllSessionReportsUsecaseCommand,
  ): Promise<FlaggingReport[]> {
    return await this.flaggingReportRepository.getAllSessionReports(
      command.page,
      command.limit,
      command.status,
    );
  }
}
