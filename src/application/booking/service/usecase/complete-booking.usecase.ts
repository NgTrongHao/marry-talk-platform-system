import { UseCase } from '../../../usecase.interface';
import { Booking } from '../../../../core/domain/entity/booking.entity';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';

@Injectable()
export class CompleteBookingUsecase implements UseCase<string, Booking> {
  constructor(
    @Inject('BookingRepository') private bookingRepository: BookingRepository,
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(bookingId: string): Promise<Booking> {
    let booking = await this.bookingRepository.findBookingById(bookingId);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    booking = Booking.changeStatus(booking, ProgressStatus.COMPLETED);

    await this.therapistRepository.updateTherapistBalance(
      booking.therapistId,
      booking.therapistService?.price
        ? booking.therapistService.price * 0.8
        : (() => {
            throw new ConflictException('Therapist service price required');
          })(),
    );

    return await this.bookingRepository.save(booking);
  }
}
