import { QuestionType } from '../../../../core/domain/entity/enum/question-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { AnswerOptionInfoResponseDto } from './answer-option-info-response.dto';
import { Question } from '../../../../core/domain/entity/question.entity';

export class TestQuestionInfoResponseDto {
  @ApiProperty()
  questionId: string;

  @ApiProperty()
  questionText: string;

  @ApiProperty()
  questionType: QuestionType;

  @ApiProperty()
  questionNo: number;

  @ApiProperty()
  testId: string;

  @ApiProperty()
  answerOptions?: AnswerOptionInfoResponseDto[];

  constructor(question: Question) {
    const data = question.props ?? question;

    this.questionId = data.id!;
    this.questionText = data.questionText;
    this.questionType = data.type;
    this.questionNo = data.questionNo;
    this.testId = data.testId;
    this.answerOptions = data.answerOptions?.map(
      (answer) => new AnswerOptionInfoResponseDto(answer),
    );
  }
}
