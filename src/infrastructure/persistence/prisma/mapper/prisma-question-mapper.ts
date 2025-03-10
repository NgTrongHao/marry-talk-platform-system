import {
  Answer as PrismaAnswer,
  PremaritalTest as PrismaPremaritalTest,
  Question as PrismaQuestion,
} from '@prisma/client';
import { Question } from '../../../../core/domain/entity/question.entity';
import { AnswerOption } from '../../../../core/domain/entity/answer-option.entity';
import { QuestionType } from '../../../../core/domain/entity/enum/question-type.enum';

export class PrismaQuestionMapper {
  static toDomain(
    entity: PrismaQuestion & {
      premaritalTest: PrismaPremaritalTest;
      answer?: PrismaAnswer[];
    },
  ): Question {
    return Question.build({
      id: entity.question_id,
      questionText: entity.question,
      questionNo: entity.question_no,
      type: entity.type as QuestionType,
      testId: entity.premaritalTest.test_id,
      answerOptions:
        entity.answer?.map((answer) =>
          AnswerOption.build({
            answer: answer.answer,
            score: answer.score,
            id: answer.answer_id,
            questionId: answer.question_id,
          }),
        ) || [],
    });
  }
}
