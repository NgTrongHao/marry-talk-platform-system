import { ApiProperty } from '@nestjs/swagger';

export class ProcessBookingPaymentDto {
  @ApiProperty({ example: 'https://your-return-url.com' })
  // @IsUrl({ require_tld: false })
  returnUrl: string;
}
