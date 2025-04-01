import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { Booking } from '../../../../core/domain/entity/booking.entity';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';

interface GetReportedBookingsUsecaseCommand {
  userId: string;
  page: number;
  limit: number;
}

@Injectable()
export class GetTherapistReportedBookingsUsecase
  implements UseCase<GetReportedBookingsUsecaseCommand, Booking[]>
{
  constructor(
    @Inject('BookingRepository') private bookingRepository: BookingRepository,
  ) {}

  async execute(
    request: GetReportedBookingsUsecaseCommand,
  ): Promise<Booking[]> {
    const { userId, page, limit } = request;
    return await this.bookingRepository.getReportedBookings(
      userId,
      page,
      limit,
    );
  }
}
