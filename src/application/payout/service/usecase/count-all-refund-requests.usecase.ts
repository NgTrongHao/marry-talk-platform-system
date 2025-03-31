import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { RefundRequestRepository } from '../../../../core/domain/repository/refund-request.repository';

@Injectable()
export class CountAllRefundRequestsUsecase
  implements
    UseCase<
      {
        status?: string;
        userId?: string;
      },
      number
    >
{
  constructor(
    @Inject('RefundRequestRepository')
    private refundRequestRepository: RefundRequestRepository,
  ) {}

  async execute({
    status,
    userId,
  }: {
    status?: string;
    userId?: string;
  }): Promise<number> {
    return await this.refundRequestRepository.countAllRefundRequests(
      status,
      userId,
    );
  }
}
