import { UseCase } from '../../../usecase.interface';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PremaritalTestRepository } from '../../../../core/domain/repository/pre-marital-test.repository';
import { GetTestByIdUsecase } from './get-test-by-id.usecase';
import { TestResult } from '../../../../core/domain/entity/test-result.entity';
import { Question } from '../../../../core/domain/entity/question.entity';
import { AnswerOption } from '../../../../core/domain/entity/answer-option.entity';

export interface SubmitTestUsecaseCommand {
  userId: string;
  testId: string;
  answers: {
    questionId: string;
    selectedAnswerIds?: string[];
    textResponse?: string;
  }[];
}

@Injectable()
export class SubmitTestUsecase
  implements UseCase<SubmitTestUsecaseCommand, any>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('PremaritalTestRepository')
    private testRepository: PremaritalTestRepository,
  ) {}

  async execute(command: SubmitTestUsecaseCommand): Promise<TestResult> {
    const test = await this.usecaseHandler.execute(
      GetTestByIdUsecase,
      command.testId,
    );

    if (!test) {
      throw new NotFoundException('Test with ' + command.testId + ' not found');
    }

    // Calculate score
    let totalScore = 0;
    const userResponse: {
      question: Question;
      selectedAnswers: AnswerOption[] | null;
      textResponse: string | null;
      score: number;
    }[] = [];

    for (const answer of command.answers) {
      let questionScore = 0;

      const question = test.questions?.find((q) => q.id === answer.questionId);
      if (!question) {
        throw new NotFoundException(
          `Question with ${answer.questionId} not found`,
        );
      }

      const answerOptions: AnswerOption[] = [];

      if (answer.selectedAnswerIds && answer.selectedAnswerIds.length > 0) {
        if (!question.answerOptions) {
          throw new NotFoundException(
            `No answer options found for question ${question.id}`,
          );
        }

        for (const answerOptionId of answer.selectedAnswerIds) {
          const answerOption = question.answerOptions.find(
            (ao) => ao.id === answerOptionId,
          );

          if (!answerOption) {
            throw new NotFoundException(
              `Answer option with ${answerOptionId} not found`,
            );
          }

          answerOptions.push(answerOption);
          questionScore += answerOption.score;
        }
      }

      userResponse.push({
        question,
        selectedAnswers: answerOptions,
        textResponse: answer.textResponse || null,
        score: questionScore,
      });

      totalScore += questionScore;
    }

    const testResult = TestResult.create({
      userId: command.userId,
      testId: command.testId,
      score: totalScore,
      userResponses: userResponse,
    });

    // Save user response
    return await this.testRepository.saveUserTestResponse(testResult);
  }
}
