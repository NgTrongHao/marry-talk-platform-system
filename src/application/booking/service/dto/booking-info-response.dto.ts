import { UserInfoResponseDto } from '../../../user/service/dto/user-info-response.dto';
import { TherapistInfoResponseDto } from '../../../user/service/dto/therapist-info-response.dto';
import { TherapistServiceInfoResponseDto } from '../../../service-package-management/service/dto/therapist-service-info-response.dto';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';
import { Booking } from '../../../../core/domain/entity/booking.entity';

export class BookingInfoResponseDto {
  bookingId: string;
  user: UserInfoResponseDto;
  therapist: TherapistInfoResponseDto;
  therapistService: TherapistServiceInfoResponseDto;
  bookingProgressStatus: ProgressStatus;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;

  constructor(
    booking: Booking,
    user: UserInfoResponseDto,
    therapist: TherapistInfoResponseDto,
    therapistService: TherapistServiceInfoResponseDto,
  ) {
    this.bookingId = booking.id!;
    this.user = user;
    this.therapist = therapist;
    this.therapistService = therapistService;
    this.bookingProgressStatus = booking.progressStatus!;
    this.createdAt = booking.createdAt!;
    this.updatedAt = booking.updatedAt!;
    this.expiresAt = booking.expiresAt!;
  }
}
