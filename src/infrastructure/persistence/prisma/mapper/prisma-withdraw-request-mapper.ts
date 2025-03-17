import { WithdrawRequest as PrismaWithdrawRequest } from '@prisma/client';
import { WithdrawRequest } from '../../../../core/domain/entity/withdraw-request.entity';
import { RequestStatus } from '../../../../core/domain/entity/enum/request-status.enum';

export class PrismaWithdrawRequestMapper {
  static toDomain(entity: PrismaWithdrawRequest): WithdrawRequest {
    return WithdrawRequest.build({
      id: entity.request_id,
      amount: entity.amount.toNumber(),
      currency: entity.currency,
      status: entity.status as RequestStatus,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
      payoutAccountId: entity.payout_account_id,
      therapistId: entity.therapist_id,
    });
  }
}
