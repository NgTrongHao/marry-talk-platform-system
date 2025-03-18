import { RequestStatus } from '../../../../core/domain/entity/enum/request-status.enum';
import { UserInfoResponseDto } from '../../../user/service/dto/user-info-response.dto';
import { SessionInfoResponseDto } from './session-info-response.dto';
import { FlaggingReport } from '../../../../core/domain/entity/flagging-report.entity';

export class FlaggingReportInfoDto {
  reportId: string;
  reportTitle: string;
  description: string;
  createdAt: Date;
  status: RequestStatus;
  reportBy: UserInfoResponseDto;
  reportFor: SessionInfoResponseDto;

  constructor(
    flaggingReport: FlaggingReport,
    reportBy: UserInfoResponseDto,
    reportFor: SessionInfoResponseDto,
  ) {
    this.reportId = flaggingReport.id!;
    this.reportTitle = flaggingReport.reportTitle;
    this.description = flaggingReport.description;
    this.createdAt = flaggingReport.createdAt!;
    this.status = flaggingReport.status!;
    this.reportBy = reportBy;
    this.reportFor = reportFor;
  }
}
