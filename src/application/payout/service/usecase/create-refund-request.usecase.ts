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
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';

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
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
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

    const allSessions = await this.bookingService.getSessionsByBookingId(
      booking.bookingId,
    );

    const completedSessions = allSessions.filter(
      (session) =>
        session.progressStatus === ProgressStatus.COMPLETED.toString(),
    );

    const sessionsNumber = booking.therapistService.package.sessions;
    const completedSessionsCount = completedSessions.length;
    const uncompletedSessionsCount = sessionsNumber - completedSessionsCount;

    if (uncompletedSessionsCount === 0) {
      throw new BadRequestException('All sessions are completed');
    }

    const totalPrice = booking.therapistService.price;
    const sessionPrice = totalPrice / sessionsNumber;

    const refundAmount = sessionPrice * uncompletedSessionsCount * 0.9;
    const therapistEarnings = sessionPrice * completedSessionsCount * 0.8;

    const refundRequest = RefundRequest.create({
      amount: refundAmount,
      currency: booking.therapistService.currency,
      accountNumber: command.accountNumber,
      bankCode: command.bankCode,
      reportId: report.reportId,
      refundTo: command.userId,
    });

    const savedRefundRequest =
      await this.refundRequestRepository.save(refundRequest);

    await this.therapistRepository.updateTherapistBalance(
      booking.therapistService.therapistId,
      therapistEarnings,
    );

    return savedRefundRequest;
  }
}
