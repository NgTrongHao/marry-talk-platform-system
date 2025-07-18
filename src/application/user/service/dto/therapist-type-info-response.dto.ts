import { TherapyInfoResponseDto } from '../../../therapy-management/service/dto/therapy-info-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TherapistTypeInfoResponseDto {
  @ApiProperty()
  therapyCategory: TherapyInfoResponseDto;

  @ApiProperty()
  therapistTypeEnabled: boolean;

  constructor(therapyCategory: TherapyInfoResponseDto, enabled: boolean) {
    this.therapyCategory = therapyCategory;
    this.therapistTypeEnabled = enabled;
  }
}
