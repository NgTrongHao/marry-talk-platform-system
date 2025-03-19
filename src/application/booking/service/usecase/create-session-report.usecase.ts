import { UseCase } from '../../../usecase.interface';
import { FlaggingReport } from '../../../../core/domain/entity/flagging-report.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SessionRepository } from '../../../../core/domain/repository/session.repository';
import { FlaggingReportRepository } from '../../../../core/domain/repository/flagging-report.repository';

interface CreateSessionReportUsecaseCommand {
  sessionId: string;
  reportBy: string;
  reportTitle: string;
  description: string;
  userId: string;
}

@Injectable()
export class CreateSessionReportUsecase
  implements UseCase<CreateSessionReportUsecaseCommand, FlaggingReport>
{
  constructor(
    @Inject('SessionRepository') private sessionRepository: SessionRepository,
    @Inject('FlaggingReportRepository')
    private flaggingReportRepository: FlaggingReportRepository,
  ) {}

  async execute(
    command: CreateSessionReportUsecaseCommand,
  ): Promise<FlaggingReport> {
    const session = await this.sessionRepository.findSessionById(
      command.sessionId,
    );
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const report = FlaggingReport.create({
      reportTitle: command.reportTitle,
      reportBy: command.reportBy,
      description: command.description,
      reportReferralId: command.sessionId,
    });

    session.reported = true;

    await this.sessionRepository.save(session);

    return await this.flaggingReportRepository.save(report);
  }
}
