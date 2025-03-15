import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsString, ValidateIf } from 'class-validator';

export class UpdateTherapistServiceRequestDto {
  @ApiProperty({ example: 'VND' })
  @IsIn(['VND', 'USD', 'EUR'])
  @ValidateIf((o: UpdateTherapistServiceRequestDto) => o.currency != null)
  currency: string;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @ValidateIf((o: UpdateTherapistServiceRequestDto) => o.price != null)
  price: number;

  @ApiProperty({ example: 60 })
  @IsNumber()
  @ValidateIf((o: UpdateTherapistServiceRequestDto) => o.timeInMinutes != null)
  timeInMinutes: number;

  @ApiProperty()
  @IsString()
  @ValidateIf((o: UpdateTherapistServiceRequestDto) => o.description == null)
  description: string;
}
