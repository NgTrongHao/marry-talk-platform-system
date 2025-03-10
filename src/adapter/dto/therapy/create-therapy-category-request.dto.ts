import { IsBoolean, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTherapyCategoryRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsBoolean()
  @ValidateIf((o: CreateTherapyCategoryRequestDto) => o.enabled != null)
  enabled?: boolean;
}
