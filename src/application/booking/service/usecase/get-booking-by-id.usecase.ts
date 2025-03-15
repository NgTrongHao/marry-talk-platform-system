import { UseCase } from '../../../usecase.interface';
import { Booking } from '../../../../core/domain/entity/booking.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';

@Injectable()
export class GetBookingByIdUsecase implements UseCase<string, Booking> {
  constructor(
    @Inject('BookingRepository')
    private bookingRepository: BookingRepository,
  ) {}

  async execute(bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findBookingById(bookingId);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }
}
