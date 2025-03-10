import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AnswerRequestDto {
  @ApiProperty({ example: 'Yes' })
  @IsString()
  @IsNotEmpty()
  answer: string;

  @ApiProperty({ example: 5 })
  @IsInt()
  score: number;
}
