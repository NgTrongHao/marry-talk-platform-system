import { UseCase } from '../../../usecase.interface';
import { Booking } from '../../../../core/domain/entity/booking.entity';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';
import { IServicePackageManagementService } from '../../../service-package-management/service-package-management-service.interface';
import { TherapistServiceInfoResponseDto } from '../../../service-package-management/service/dto/therapist-service-info-response.dto';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { AddTherapySessionUsecase } from './add-therapy-session.usecase';

export interface CreateBookingUsecaseCommand {
  therapistServiceId: string;
  userId: string;
  addSession: {
    sessionDate: Date;
    startTime: string;
  };
}

@Injectable()
export class CreateBookingUsecase
  implements UseCase<CreateBookingUsecaseCommand, Booking>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('BookingRepository')
    private bookingRepository: BookingRepository,
    @Inject('IServicePackageManagementService')
    private readonly servicePackageManagementService: IServicePackageManagementService,
  ) {}

  async execute(command: CreateBookingUsecaseCommand): Promise<Booking> {
    let therapistService: TherapistServiceInfoResponseDto;
    try {
      therapistService =
        await this.servicePackageManagementService.getTherapistServiceById(
          command.therapistServiceId,
        );
    } catch {
      throw new BadRequestException('Therapist service not found');
    }

    if (!therapistService.enabled) {
      throw new BadRequestException('Therapist service is disabled');
    }

    const booking = Booking.create({
      therapistServiceId: therapistService.id,
      servicePackageId: therapistService.package.id,
      therapistId: therapistService.therapistId,
      therapyId: therapistService.therapyCategory.id,
      userId: command.userId,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    await this.usecaseHandler.execute(AddTherapySessionUsecase, {
      bookingId: savedBooking.id,
      sessionDate: command.addSession.sessionDate,
      startTime: command.addSession.startTime,
    });

    return savedBooking;
  }
}
