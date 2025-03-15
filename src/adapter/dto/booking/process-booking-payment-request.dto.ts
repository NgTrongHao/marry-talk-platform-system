import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class ProcessBookingPaymentDto {
  @ApiProperty({ example: 'https://your-return-url.com' })
  @IsUrl()
  returnUrl: string;
}
