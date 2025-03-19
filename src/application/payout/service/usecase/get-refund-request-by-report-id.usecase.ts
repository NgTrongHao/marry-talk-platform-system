import { UseCase } from '../../../usecase.interface';
import { RefundRequest } from '../../../../core/domain/entity/refund-request.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RefundRequestRepository } from '../../../../core/domain/repository/refund-request.repository';
import { IBookingService } from '../../../booking/booking-service.interface';

@Injectable()
export class GetRefundRequestByReportIdUsecase
  implements UseCase<string, RefundRequest>
{
  constructor(
    @Inject('RefundRequestRepository')
    private refundRequestRepository: RefundRequestRepository,
    @Inject('IBookingService') private readonly bookingService: IBookingService,
  ) {}

  async execute(reportId: string): Promise<RefundRequest> {
    const request =
      await this.refundRequestRepository.getRefundRequestByReportId(reportId);

    if (!request) {
      throw new NotFoundException('Refund request not found');
    }

    return request;
  }
}
