import { Injectable } from '@nestjs/common';
import { RefundRequestRepository } from '../../../../core/domain/repository/refund-request.repository';
import { PrismaService } from '../prisma.service';
import { RefundRequest } from '../../../../core/domain/entity/refund-request.entity';
import { PrismaRefundRequestMapper } from '../mapper/prisma-refund-request-mapper';
import { RequestStatus } from '../../../../core/domain/entity/enum/request-status.enum';

@Injectable()
export class PrismaRefundRequestRepository implements RefundRequestRepository {
  constructor(private prisma: PrismaService) {}

  async save(refundRequest: RefundRequest): Promise<RefundRequest> {
    return this.prisma.refundRequest
      .upsert({
        where: {
          request_id: refundRequest.id,
        },
        update: {
          amount: refundRequest.amount,
          currency: refundRequest.currency,
          account_number: refundRequest.accountNumber,
          bank_code: refundRequest.bankCode,
          report_id: refundRequest.reportId,
          user_id: refundRequest.refundTo,
          status: refundRequest.status,
        },
        create: {
          request_id: refundRequest.id,
          amount: refundRequest.amount,
          currency: refundRequest.currency,
          account_number: refundRequest.accountNumber,
          bank_code: refundRequest.bankCode,
          report_id: refundRequest.reportId,
          user_id: refundRequest.refundTo,
          status: refundRequest.status,
        },
      })
      .then((result) => PrismaRefundRequestMapper.toDomain(result));
  }

  async getRefundRequestByReportId(
    reportId: string,
  ): Promise<RefundRequest | null> {
    return this.prisma.refundRequest
      .findFirst({
        where: {
          report_id: reportId,
        },
      })
      .then((result) => {
        if (result === null) {
          return null;
        }
        return PrismaRefundRequestMapper.toDomain(result);
      });
  }

  async getRefundRequestsByUserId(userId: string): Promise<RefundRequest[]> {
    return this.prisma.refundRequest
      .findMany({
        where: {
          user_id: userId,
        },
      })
      .then((results) =>
        results.map((result) => PrismaRefundRequestMapper.toDomain(result)),
      );
  }

  async findByBookingId(bookingId: string): Promise<RefundRequest | null> {
    return this.prisma.refundRequest
      .findFirst({
        where: {
          report: {
            session: {
              booking: {
                booking_id: bookingId,
              },
            },
          },
        },
      })
      .then((result) => {
        if (result === null) {
          return null;
        }
        return PrismaRefundRequestMapper.toDomain(result);
      });
  }

  async getRefundRequestById(
    refundRequestId: string,
  ): Promise<RefundRequest | null> {
    return this.prisma.refundRequest
      .findUnique({
        where: {
          request_id: refundRequestId,
        },
      })
      .then((result) => {
        if (result === null) {
          return null;
        }
        return PrismaRefundRequestMapper.toDomain(result);
      });
  }

  async countAllRefundRequests(
    status: string | undefined,
    userId: string | undefined,
  ): Promise<number> {
    return this.prisma.refundRequest
      .count({
        where: {
          status: status as RequestStatus,
          user_id: userId ? userId : undefined,
        },
      })
      .then((result) => result);
  }

  async getAllRefundRequests(
    page: number,
    limit: number,
    status: string | undefined,
    userId: string | undefined,
  ): Promise<RefundRequest[]> {
    return this.prisma.refundRequest
      .findMany({
        where: {
          status: status ? (status as RequestStatus) : undefined,
          user_id: userId ?? undefined,
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          updated_at: 'desc',
        },
      })
      .then((results) =>
        results.map((result) => PrismaRefundRequestMapper.toDomain(result)),
      );
  }
}
