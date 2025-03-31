import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { RefundRequest } from '../../../../core/domain/entity/refund-request.entity';
import { RefundRequestRepository } from '../../../../core/domain/repository/refund-request.repository';

interface GetAllRefundRequestsUsecaseCommand {
  page: number;
  limit: number;
  status?: string;
  userId?: string;
}

@Injectable()
export class GetAllRefundRequestsUsecase
  implements UseCase<GetAllRefundRequestsUsecaseCommand, RefundRequest[]>
{
  constructor(
    @Inject('RefundRequestRepository')
    private refundRequestRepository: RefundRequestRepository,
  ) {}

  async execute(
    command: GetAllRefundRequestsUsecaseCommand,
  ): Promise<RefundRequest[]> {
    const requests = await this.refundRequestRepository.getAllRefundRequests(
      command.page,
      command.limit,
      command.status,
      command.userId,
    );

    // sort requests by updated date
    return requests.sort((a, b) => {
      const updatedAtA = a.updatedAt!;
      const updatedAtB = b.updatedAt!;

      if (updatedAtA < updatedAtB) {
        return 1;
      }
      if (updatedAtA > updatedAtB) {
        return -1;
      }
      return 0;
    });
  }
}
