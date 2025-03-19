import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { RefundRequest } from '../../../../core/domain/entity/refund-request.entity';
import { RefundRequestRepository } from '../../../../core/domain/repository/refund-request.repository';
import { IBookingService } from '../../../booking/booking-service.interface';
import { RequestStatus } from '../../../../core/domain/entity/enum/request-status.enum';

interface CreateRefundRequestUsecaseCommand {
  reportId: string;
  accountNumber: string;
  bankCode: string;
  userId: string;
}

@Injectable()
export class CreateRefundRequestUsecase
  implements UseCase<CreateRefundRequestUsecaseCommand, RefundRequest>
{
  constructor(
    @Inject('RefundRequestRepository')
    private refundRequestRepository: RefundRequestRepository,
    @Inject('IBookingService') private readonly bookingService: IBookingService,
  ) {}

  async execute(
    command: CreateRefundRequestUsecaseCommand,
  ): Promise<RefundRequest> {
    const report = await this.bookingService.getSessionReportById(
      command.reportId,
    );

    if (report.status != RequestStatus.APPROVED) {
      throw new BadRequestException(
        'Refund request can only be created for approved reports',
      );
    }

    const booking = await this.bookingService.getBookingById(
      report.reportFor.booking.bookingId,
    );

    if (command.userId !== booking.user.userId) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }

    const existingRefundRequest =
      await this.refundRequestRepository.findByBookingId(booking.bookingId);

    if (existingRefundRequest) {
      throw new BadRequestException(
        'Refund request already exists for booking',
      );
    }

    const refundRequest = RefundRequest.create({
      amount: booking.therapistService.price,
      currency: booking.therapistService.currency,
      accountNumber: command.accountNumber,
      bankCode: command.bankCode,
      reportId: report.reportId,
      refundTo: command.userId,
    });

    return await this.refundRequestRepository.save(refundRequest);
  }
}
