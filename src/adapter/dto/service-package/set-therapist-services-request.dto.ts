import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateTherapistServiceRequestDto } from './create-therapist-service-request.dto';
import { Type } from 'class-transformer';

export class SetTherapistServicesRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  therapyId: string;

  @ApiProperty({ type: [CreateTherapistServiceRequestDto] })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTherapistServiceRequestDto)
  therapistServices: CreateTherapistServiceRequestDto[];
}
