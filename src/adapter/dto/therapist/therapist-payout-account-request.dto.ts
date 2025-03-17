import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class TherapistPayoutAccountRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  bankCode: string;

  @ApiProperty()
  @ValidateIf((o: TherapistPayoutAccountRequestDto) => o.accountName != null)
  @IsString()
  accountName: string;
}
