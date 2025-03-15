import { UseCase } from '../../../usecase.interface';
import {
  ConflictException,
  GoneException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';
import { Booking } from '../../../../core/domain/entity/booking.entity';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { CreatePaymentTransactionUsecase } from './create-payment-transaction.usecase';
import { ReferenceTransactionStatusEnum } from '../../../../core/domain/entity/enum/reference-transaction-status.enum';
import { BookingPaymentInfoDto } from '../dto/booking-payment-info.dto';
import { IUsersService } from '../../../user/users-service.interface';

export interface ProcessBookingPaymentUsecaseCommand {
  userId: string;
  bookingId: string;
  ipAddress: string;
  returnUrl: string;
}

@Injectable()
export class ProcessBookingPaymentUsecase
  implements UseCase<ProcessBookingPaymentUsecaseCommand, BookingPaymentInfoDto>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('BookingRepository')
    private readonly bookingRepository: BookingRepository,
    @Inject('IUsersService') private readonly userService: IUsersService,
  ) {}

  async execute(
    command: ProcessBookingPaymentUsecaseCommand,
  ): Promise<BookingPaymentInfoDto> {
    const booking = await this.getBooking(command.bookingId);
    this.validateBooking(booking);

    const { amount, currency } = this.getBookingDetails(booking);

    await this.usecaseHandler.execute(CreatePaymentTransactionUsecase, {
      bookingId: booking.id!,
      amount: amount,
      currency: currency,
      transactionStatus: ReferenceTransactionStatusEnum.PENDING,
      changedBy: command.userId,
      returnUrl: command.returnUrl,
    });

    return new BookingPaymentInfoDto(
      booking.id!,
      await this.userService
        .getUserById({ userId: command.userId })
        .then((user) => {
          return user.username;
        }),
      await this.userService
        .getUserById({ userId: booking.therapistId })
        .then((user) => {
          return user.firstName + ' ' + user.lastName;
        }),
      booking.therapistService?.package?.name ?? '',
      amount,
      currency,
    );
  }

  private async getBooking(bookingId: string) {
    const booking = await this.bookingRepository.findBookingById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  private validateBooking(booking: Booking) {
    if (booking.expiresAt! < new Date()) {
      throw new GoneException('Booking has expired');
    }
    if (booking.progressStatus !== ProgressStatus.PENDING) {
      throw new ConflictException('Booking has been paid');
    }
  }

  private getBookingDetails(booking: Booking) {
    const amount = booking.therapistService?.price;
    const currency = booking.therapistService?.currency;

    if (amount === undefined || currency === undefined) {
      throw new Error('Invalid booking details');
    }

    return { amount, currency };
  }
}
