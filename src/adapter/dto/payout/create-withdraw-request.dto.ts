import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateWithdrawRequestDto {
  @ApiProperty({
    description: 'Amount to withdraw',
    example: 100,
  })
  @IsNotEmpty({ message: 'Amount is required' })
  @IsPositive({ message: 'Amount must be greater than 0' })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'VND',
  })
  @IsNotEmpty({ message: 'Currency is required' })
  @IsString()
  currency: string;
}
