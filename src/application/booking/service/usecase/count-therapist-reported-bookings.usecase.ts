import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';

@Injectable()
export class CountTherapistReportedBookingsUsecase
  implements UseCase<string, number>
{
  constructor(
    @Inject('BookingRepository')
    private bookingRepository: BookingRepository,
  ) {}

  async execute(therapistId: string): Promise<number> {
    return await this.bookingRepository.countTherapistReportedBookings(
      therapistId,
    );
  }
}
