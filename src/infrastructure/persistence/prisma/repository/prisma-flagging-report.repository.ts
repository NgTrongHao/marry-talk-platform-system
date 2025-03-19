import { Injectable } from '@nestjs/common';
import { FlaggingReportRepository } from '../../../../core/domain/repository/flagging-report.repository';
import { PrismaService } from '../prisma.service';
import { FlaggingReport } from '../../../../core/domain/entity/flagging-report.entity';
import { PrismaFlaggingReportMapper } from '../mapper/prisma-flagging-report-mapper';
import { RequestStatus } from '@prisma/client';

@Injectable()
export class PrismaFlaggingReportRepository
  implements FlaggingReportRepository
{
  constructor(private prisma: PrismaService) {}

  async save(flaggingReport: FlaggingReport): Promise<FlaggingReport> {
    const savedFlaggingReport = await this.prisma.report.upsert({
      where: { report_id: flaggingReport.id },
      update: {
        title: flaggingReport.reportTitle,
        report_by: flaggingReport.reportBy,
        description: flaggingReport.description,
        status: flaggingReport.status,
        report_for: flaggingReport.reportReferralId,
      },
      create: {
        title: flaggingReport.reportTitle,
        report_by: flaggingReport.reportBy,
        description: flaggingReport.description,
        status: flaggingReport.status,
        report_for: flaggingReport.reportReferralId,
      },
    });

    return PrismaFlaggingReportMapper.toDomain(savedFlaggingReport);
  }

  async getAllSessionReports(
    page: number,
    limit: number,
    status: string | undefined,
  ): Promise<FlaggingReport[]> {
    return this.prisma.report
      .findMany({
        where: {
          status: status ? (status as RequestStatus) : undefined,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
      })
      .then((reports) =>
        reports.map((report) => PrismaFlaggingReportMapper.toDomain(report)),
      );
  }

  async findById(reportId: string): Promise<FlaggingReport | null> {
    return this.prisma.report
      .findUnique({
        where: { report_id: reportId },
      })
      .then((report) =>
        report ? PrismaFlaggingReportMapper.toDomain(report) : null,
      );
  }

  async getAllSessionReportsByTherapistId(
    therapistId: string,
    page: number,
    limit: number,
    status: string | undefined,
  ): Promise<FlaggingReport[]> {
    return this.prisma.report
      .findMany({
        where: {
          status: status ? (status as RequestStatus) : undefined,
          session: {
            therapist_id: therapistId,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
      })
      .then((reports) =>
        reports.map((report) => PrismaFlaggingReportMapper.toDomain(report)),
      );
  }
}
