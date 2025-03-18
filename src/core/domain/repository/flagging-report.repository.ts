import { FlaggingReport } from '../entity/flagging-report.entity';

export interface FlaggingReportRepository {
  save(report: FlaggingReport): Promise<FlaggingReport>;

  getAllSessionReports(
    page: number,
    limit: number,
    status: string | undefined,
  ): Promise<FlaggingReport[]>;

  findById(reportId: string): Promise<FlaggingReport | null>;

  getAllSessionReportsByTherapistId(
    therapistId: string,
    page: number,
    limit: number,
    status: string | undefined,
  ): Promise<FlaggingReport[]>;
}
