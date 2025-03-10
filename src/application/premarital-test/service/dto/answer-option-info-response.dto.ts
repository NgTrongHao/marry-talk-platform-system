import { ApiProperty } from '@nestjs/swagger';
import { AnswerOption } from '../../../../core/domain/entity/answer-option.entity';

export class AnswerOptionInfoResponseDto {
  @ApiProperty()
  answerId: string;

  @ApiProperty()
  answer: string;

  @ApiProperty()
  score: number;

  @ApiProperty()
  questionId: string;

  constructor(answer: AnswerOption) {
    const data = answer.props ?? answer;

    this.answerId = data.id!;
    this.answer = data.answer;
    this.score = data.score;
    this.questionId = data.questionId;
  }
}
