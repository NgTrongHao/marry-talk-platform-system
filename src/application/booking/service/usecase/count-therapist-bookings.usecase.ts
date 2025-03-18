import { UseCase } from '../../../usecase.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';

interface CountTherapistBookingsUsecaseCommand {
  therapistId: string;
  status?: ProgressStatus;
  from?: Date;
  to?: Date;
}

@Injectable()
export class CountTherapistBookingsUsecase
  implements UseCase<CountTherapistBookingsUsecaseCommand, number>
{
  constructor(
    @Inject('BookingRepository') private bookingRepository: BookingRepository,
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(
    command: CountTherapistBookingsUsecaseCommand,
  ): Promise<number> {
    const therapist = await this.therapistRepository.getTherapistProfileById(
      command.therapistId,
    );

    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    return await this.bookingRepository.countTherapistBookings(
      command.therapistId,
      command.status,
      command.from,
      command.to,
    );
  }
}
