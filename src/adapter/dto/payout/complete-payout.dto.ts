import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
} from 'class-validator';

export class CompletePayoutDto {
  @ApiProperty({
    description: 'Amount',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'Currency',
    example: 'VND',
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Reference Transaction Id',
    example: 'transfer-transaction-code',
  })
  @IsNotEmpty()
  @IsString()
  referenceTransactionId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  imageUrl: string;
}
