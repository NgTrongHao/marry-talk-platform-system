import {
  Answer as PrismaAnswer,
  PremaritalTest as PrismaPremaritalTest,
  Question as PrismaQuestion,
  TestResult as PrismaTestResult,
  TherapyTest as PrismaTherapyTest,
} from '@prisma/client';
import { PremaritalTest } from '../../../../core/domain/entity/pre-marital-test.entity';
import { TestResult } from '../../../../core/domain/entity/test-result.entity';
import { Question } from '../../../../core/domain/entity/question.entity';
import { AnswerOption } from '../../../../core/domain/entity/answer-option.entity';
import { PrismaQuestionMapper } from './prisma-question-mapper';

export class PrismaPreMaritalTestMapper {
  static toDomain(
    entity: PrismaPremaritalTest & {
      therapyTest: PrismaTherapyTest[];
      questions: (PrismaQuestion & {
        premaritalTest: PrismaPremaritalTest;
        answer?: PrismaAnswer[];
      })[];
    },
  ) {
    return PremaritalTest.build({
      id: entity.test_id,
      name: entity.test_name,
      description: entity.description,
      therapyCategories: entity.therapyTest.map((test) => test.therapy_id),
      questions: entity.questions.map((question) =>
        PrismaQuestionMapper.toDomain(question),
      ),
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
    });
  }

  static toTestResult(entity: PrismaTestResult) {
    return TestResult.build({
      id: entity.result_id,
      testId: entity.test_id,
      userId: entity.user_id,
      score: entity.total_score.toNumber(),
      userResponses: JSON.parse(entity.user_response as string) as Array<{
        question: Question;
        selectedAnswers: AnswerOption[] | null;
        textResponse: string | null;
        score: number;
      }>,
      createdAt: entity.created_at,
    });
  }
}
