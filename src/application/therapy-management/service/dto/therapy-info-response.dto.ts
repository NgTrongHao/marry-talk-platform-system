import { ApiProperty } from '@nestjs/swagger';
import { TherapyCategory } from '../../../../core/domain/entity/therapy-category.entity';

export class TherapyInfoResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  enabled?: boolean;

  constructor(therapy: TherapyCategory) {
    this.id = therapy.id!;
    this.name = therapy.name;
    this.description = therapy.description;
    this.enabled = therapy.enabled;
  }
}
