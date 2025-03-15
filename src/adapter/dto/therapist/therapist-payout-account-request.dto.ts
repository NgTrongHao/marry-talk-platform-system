import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TherapistPayoutAccountRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  bankCode: string;

  @ApiProperty()
  accountName: string;
}
