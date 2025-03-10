import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UsecaseHandler } from '../../usecase-handler.service';
import { IPremaritalTestService } from '../pre-marital-test-service.interface';
import {
  CreateTestUsecase,
  CreateTestUsecaseCommand,
} from './usecase/create-test.usecase';
import { PreMaritalTestInfoResponseDto } from './dto/pre-marital-test-info-response.dto';
import { ITherapyManagementService } from '../../therapy-management/therapy-management-service.interface';
import { GetAllTestsUsecase } from './usecase/get-all-tests.usecase';
import { CreateQuestionUsecase } from './usecase/create-question.usecase';
import { QuestionType } from '../../../core/domain/entity/enum/question-type.enum';
import { TestQuestionInfoResponseDto } from './dto/test-question-info-response.dto';
import { AddAnswerToQuestionUsecase } from './usecase/add-answer-to-question.usecase';
import { GetTestByIdUsecase } from './usecase/get-test-by-id.usecase';
import { TherapyInfoResponseDto } from '../../therapy-management/service/dto/therapy-info-response.dto';
import { GetQuestionsOfTestUsecase } from './usecase/get-questions-of-test.usecase';
import { CountQuestionsOfTestUsecase } from './usecase/count-questions-of-test.usecase';
import {
  SubmitTestUsecase,
  SubmitTestUsecaseCommand,
} from './usecase/submit-test.usecase';
import { TestResultInfoResponseDto } from './dto/test-result-info-response.dto';
import * as console from 'node:console';
import { GetUserDoneTestsUsecase } from './usecase/get-user-done-tests.usecase';
import { CountUserDoneTestsUsecase } from './usecase/count-user-done-tests.usecase';
import { GetTestResultByIdUsecase } from './usecase/get-test-result-by-id.usecase';

@Injectable()
export class PreMaritalTestService implements IPremaritalTestService {
  constructor(
    private useCaseHandler: UsecaseHandler,
    @Inject('ITherapyManagementService')
    private therapyManagementService: ITherapyManagementService,
  ) {}

  async createTest(
    command: CreateTestUsecaseCommand,
  ): Promise<PreMaritalTestInfoResponseDto> {
    return this.useCaseHandler
      .execute(CreateTestUsecase, command)
      .then(async (result) => {
        return new PreMaritalTestInfoResponseDto(
          result,
          await Promise.all(
            result.therapyCategories.map((therapy) =>
              this.getTherapyCategoryById(therapy),
            ),
          ),
        );
      });
  }

  async getAllTests(request: {
    therapyId?: string;
    page: number;
    limit: number;
  }): Promise<PreMaritalTestInfoResponseDto[]> {
    const skip = (request.page - 1) * request.limit;
    const take = Number(request.limit);
    return this.useCaseHandler
      .execute(GetAllTestsUsecase, {
        therapyId: request.therapyId,
        skip,
        take,
      })
      .then(async (result) => {
        return await Promise.all(
          result.map(async (test) => {
            return new PreMaritalTestInfoResponseDto(
              test,
              await Promise.all(
                test.therapyCategories.map((therapy) =>
                  this.getTherapyCategoryById(therapy),
                ),
              ),
            );
          }),
        );
      });
  }

  async addQuestion(request: {
    premaritalTestId: string;
    question: string;
    questionType: QuestionType;
    questionNo: number;
    answers?: {
      answer: string;
      score: number;
    }[];
  }): Promise<TestQuestionInfoResponseDto> {
    return this.useCaseHandler
      .execute(CreateQuestionUsecase, request)
      .then((result) => {
        return new TestQuestionInfoResponseDto(result);
      });
  }

  async addAnswer(request: {
    questionId: string;
    answer: string;
    score: number;
  }): Promise<TestQuestionInfoResponseDto> {
    return await this.useCaseHandler
      .execute(AddAnswerToQuestionUsecase, request)
      .then((result) => {
        return new TestQuestionInfoResponseDto(result);
      });
  }

  async getQuestionsByTestId(request: {
    testId: string;
    page: number;
    limit: number;
  }): Promise<{
    questions: TestQuestionInfoResponseDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }> {
    const skip = (request.page - 1) * request.limit;
    const take = Number(request.limit);

    const [questions, total] = await Promise.all([
      this.useCaseHandler
        .execute(GetQuestionsOfTestUsecase, {
          testId: request.testId,
          skip,
          take,
        })
        .then((result) =>
          result.map((question) => new TestQuestionInfoResponseDto(question)),
        ),
      this.useCaseHandler.execute(CountQuestionsOfTestUsecase, request.testId),
    ]);

    return {
      questions,
      page: request.page,
      limit: request.limit,
      total: total,
      totalPages: Math.ceil(total / request.limit),
    };
  }

  async getTestById(id: string): Promise<PreMaritalTestInfoResponseDto> {
    const result = await this.useCaseHandler.execute(GetTestByIdUsecase, id);

    if (!result) {
      throw new NotFoundException('Test with id ' + id + ' not found');
    }

    return new PreMaritalTestInfoResponseDto(
      result,
      await Promise.all(
        result.therapyCategories.map((therapy) =>
          this.getTherapyCategoryById(therapy),
        ),
      ),
    );
  }

  async submitUserTestResponse(
    request: SubmitTestUsecaseCommand,
  ): Promise<TestResultInfoResponseDto> {
    return await this.useCaseHandler
      .execute(SubmitTestUsecase, request)
      .then((result) => {
        console.info('result', JSON.stringify(result));
        return new TestResultInfoResponseDto(result);
      });
  }

  private async getTherapyCategoryById(
    id: string,
  ): Promise<TherapyInfoResponseDto> {
    return await this.therapyManagementService.getTherapyCategoryById({ id });
  }

  async getUserDoneTests(request: {
    userId: string;
    page: number;
    limit: number;
    therapyId?: string;
  }): Promise<{
    tests: {
      test: PreMaritalTestInfoResponseDto;
      testResultId: string;
      testDate: Date;
      score: number;
    }[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }> {
    const skip = (request.page - 1) * request.limit;
    const take = Number(request.limit);

    const [tests, total] = await Promise.all([
      this.useCaseHandler.execute(GetUserDoneTestsUsecase, {
        userId: request.userId,
        skip,
        take,
        therapyId: request.therapyId,
      }),
      this.useCaseHandler.execute(CountUserDoneTestsUsecase, request.userId),
    ]);

    const resolvedTests = await Promise.all(
      tests.map(async (test) => ({
        test: await this.getTestById(test.testId),
        testResultId: test.id!,
        testDate: test.createdAt!,
        score: test.score,
      })),
    );

    return {
      tests: resolvedTests.sort(
        (a, b) => b.testDate.getTime() - a.testDate.getTime(),
      ),
      page: request.page,
      limit: request.limit,
      total,
      totalPages: Math.ceil(total / request.limit),
    };
  }

  async getTestResultById(
    resultId: string,
  ): Promise<TestResultInfoResponseDto> {
    return await this.useCaseHandler
      .execute(GetTestResultByIdUsecase, resultId)
      .then((result) => new TestResultInfoResponseDto(result));
  }
}
