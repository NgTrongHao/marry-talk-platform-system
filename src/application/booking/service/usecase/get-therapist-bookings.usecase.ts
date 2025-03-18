import { UseCase } from '../../../usecase.interface';
import { Booking } from '../../../../core/domain/entity/booking.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';

interface GetTherapistBookingsUsecaseCommand {
  therapistId: string;
  page: number;
  limit: number;
  status: ProgressStatus | undefined;
  fromDate: Date | undefined;
  toDate: Date | undefined;
}

@Injectable()
export class GetTherapistBookingsUsecase
  implements UseCase<GetTherapistBookingsUsecaseCommand, Booking[]>
{
  constructor(
    @Inject('BookingRepository') private bookingRepository: BookingRepository,
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(
    command: GetTherapistBookingsUsecaseCommand,
  ): Promise<Booking[]> {
    const therapist = await this.therapistRepository.getTherapistProfileById(
      command.therapistId,
    );

    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    return this.bookingRepository.getTherapistBookings(
      command.therapistId,
      command.page,
      command.limit,
      command.status,
      command.fromDate,
      command.toDate,
    );
  }
}
