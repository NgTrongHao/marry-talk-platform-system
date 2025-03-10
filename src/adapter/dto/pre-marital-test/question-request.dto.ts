import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AnswerRequestDto } from './answer-request.dto';
import { Type } from 'class-transformer';
import { QuestionType } from '../../../core/domain/entity/enum/question-type.enum';

export class QuestionRequestDto {
  @ApiProperty({ example: 'What is your biggest fear in marriage?' })
  @IsString()
  @IsNotEmpty()
  question: string;

  @ApiProperty({ enum: QuestionType })
  @IsEnum(QuestionType)
  questionType: QuestionType;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsNotEmpty()
  questionNo: number;

  @ApiProperty({ type: [AnswerRequestDto], required: false })
  @ValidateNested({ each: true })
  @Type(() => AnswerRequestDto)
  @IsOptional()
  answers?: AnswerRequestDto[];
}
