import { UseCase } from '../../../usecase.interface';
import { FlaggingReport } from '../../../../core/domain/entity/flagging-report.entity';
import { Inject, Injectable } from '@nestjs/common';
import { FlaggingReportRepository } from '../../../../core/domain/repository/flagging-report.repository';

interface GetTherapistSessionReportsUsecaseCommand {
  therapistId: string;
  page: number;
  limit: number;
  status: string | undefined;
}

@Injectable()
export class GetTherapistSessionReportsUsecase
  implements UseCase<GetTherapistSessionReportsUsecaseCommand, FlaggingReport[]>
{
  constructor(
    @Inject('FlaggingReportRepository')
    private flaggingReportRepository: FlaggingReportRepository,
  ) {}

  async execute(
    command: GetTherapistSessionReportsUsecaseCommand,
  ): Promise<FlaggingReport[]> {
    return await this.flaggingReportRepository.getAllSessionReportsByTherapistId(
      command.therapistId,
      command.page,
      command.limit,
      command.status,
    );
  }
}
