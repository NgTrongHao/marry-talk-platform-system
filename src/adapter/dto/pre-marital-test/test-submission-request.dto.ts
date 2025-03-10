import { AnswerSubmissionRequestDto } from './answer-submission-request.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TestSubmissionRequestDto {
  @ApiProperty({ example: 'test-uuid' })
  @IsString()
  @IsNotEmpty()
  testId: string;

  @ApiProperty({ type: [AnswerSubmissionRequestDto] })
  @ValidateNested({ each: true })
  @Type(() => AnswerSubmissionRequestDto)
  answers: AnswerSubmissionRequestDto[];
}
