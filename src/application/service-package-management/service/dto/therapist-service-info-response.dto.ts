import { TherapyInfoResponseDto } from '../../../therapy-management/service/dto/therapy-info-response.dto';
import { ServicePackageInfoResponseDto } from './service-package-info-response.dto';
import { TherapistService } from '../../../../core/domain/entity/therapist-service.entity';

export class TherapistServiceInfoResponseDto {
  id: string;
  therapistId: string;
  therapyCategory: TherapyInfoResponseDto;
  price: number;
  currency: string;
  timeInMinutes: number;
  description: string;
  package: ServicePackageInfoResponseDto;

  constructor(
    therapistService: TherapistService,
    therapyCategory: TherapyInfoResponseDto,
  ) {
    this.id = therapistService.id!;
    this.therapistId = therapistService.therapistId;
    this.therapyCategory = therapyCategory;
    this.price = therapistService.price;
    this.currency = therapistService.currency;
    this.timeInMinutes = therapistService.timeInMinutes;
    this.description = therapistService.description;
    this.package = new ServicePackageInfoResponseDto(therapistService.package);
  }
}
