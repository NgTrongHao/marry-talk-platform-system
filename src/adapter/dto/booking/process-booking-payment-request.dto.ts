import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ProcessBookingPaymentDto {
  @ApiProperty({ example: 'https://your-return-url.com' })
  // @IsUrl({ require_tld: false })
  @IsString()
  returnUrl: string;
}
