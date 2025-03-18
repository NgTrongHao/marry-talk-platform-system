import { RefundRequest as PrismaRefundRequest } from '@prisma/client';
import { RefundRequest } from '../../../../core/domain/entity/refund-request.entity';
import { RequestStatus } from '../../../../core/domain/entity/enum/request-status.enum';

export class PrismaRefundRequestMapper {
  static toDomain(entity: PrismaRefundRequest): RefundRequest {
    return RefundRequest.build({
      id: entity.request_id,
      amount: entity.amount.toNumber(),
      currency: entity.currency,
      status: entity.status as RequestStatus,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
      accountNumber: entity.account_number,
      bankCode: entity.bank_code,
      refundTo: entity.user_id,
      reportId: entity.report_id,
    });
  }
}
