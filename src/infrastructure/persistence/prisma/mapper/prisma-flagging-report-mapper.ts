import { Report } from '@prisma/client';
import { FlaggingReport } from '../../../../core/domain/entity/flagging-report.entity';
import { RequestStatus } from '../../../../core/domain/entity/enum/request-status.enum';

export class PrismaFlaggingReportMapper {
  static toDomain(entity: Report): FlaggingReport {
    return FlaggingReport.build({
      id: entity.report_id,
      reportTitle: entity.title,
      reportBy: entity.report_by,
      description: entity.description,
      status: entity.status as RequestStatus,
      reportReferralId: entity.report_for,
      createdAt: entity.created_at,
    });
  }
}
