import { UseCase } from '../../../usecase.interface';
import { Booking } from '../../../../core/domain/entity/booking.entity';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';

interface RateBookingUsecaseCommand {
  bookingId: string;
  userId: string;
  rating: number;
}

@Injectable()
export class RateBookingUsecase
  implements UseCase<RateBookingUsecaseCommand, Booking>
{
  constructor(
    @Inject('BookingRepository')
    private bookingRepository: BookingRepository,
  ) {}

  async execute(command: RateBookingUsecaseCommand): Promise<Booking> {
    let booking = await this.bookingRepository.findBookingById(
      command.bookingId,
    );

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== command.userId) {
      throw new ForbiddenException('User is not allowed to rate this booking');
    }

    if (booking.rating === null) {
      throw new BadRequestException('Booking already rated');
    }

    booking = Booking.rate(booking, command.rating);

    return this.bookingRepository.save(booking);
  }
}
