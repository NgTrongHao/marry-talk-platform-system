import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTherapistServiceRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  servicePackageId: string;

  @ApiProperty({ example: 'VND' })
  @IsNotEmpty()
  @IsIn(['VND', 'USD', 'EUR'])
  currency: string;

  @ApiProperty({ example: 500000 })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}
