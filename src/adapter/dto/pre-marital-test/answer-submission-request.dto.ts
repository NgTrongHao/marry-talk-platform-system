import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AnswerSubmissionRequestDto {
  @ApiProperty({ example: 'question-uuid' })
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({ example: ['answer-uuid-1', 'answer-uuid-2'], required: false })
  @IsString({ each: true })
  @IsOptional()
  selectedAnswerIds?: string[];

  @ApiProperty({
    example: 'My biggest fear in marriage is lack of communication.',
    required: false,
  })
  @IsString()
  @IsOptional()
  textResponse?: string;
}
