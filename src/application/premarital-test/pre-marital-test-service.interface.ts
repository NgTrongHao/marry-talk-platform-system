import { PreMaritalTestInfoResponseDto } from './service/dto/pre-marital-test-info-response.dto';
import { QuestionType } from '../../core/domain/entity/enum/question-type.enum';
import { TestQuestionInfoResponseDto } from './service/dto/test-question-info-response.dto';
import { SubmitTestUsecaseCommand } from './service/usecase/submit-test.usecase';
import { TestResultInfoResponseDto } from './service/dto/test-result-info-response.dto';

export interface IPremaritalTestService {
  createTest(request: {
    name: string;
    description: string;
    therapyCategoryIds: string[];
  }): Promise<PreMaritalTestInfoResponseDto>;

  getAllTests(request: {
    therapyId?: string;
    page: number;
    limit: number;
  }): Promise<PreMaritalTestInfoResponseDto[]>;

  getTestById(id: string): Promise<PreMaritalTestInfoResponseDto>;

  addQuestion(request: {
    premaritalTestId: string;
    question: string;
    questionType: QuestionType;
    questionNo: number;
    answers?: {
      answer: string;
      score: number;
    }[];
  }): Promise<TestQuestionInfoResponseDto>;

  getQuestionsByTestId({ testId, page, limit }): Promise<{
    questions: TestQuestionInfoResponseDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>;

  addAnswer(request: {
    questionId: string;
    answer: string;
    score: number;
  }): Promise<TestQuestionInfoResponseDto>;

  submitUserTestResponse(
    request: SubmitTestUsecaseCommand,
  ): Promise<TestResultInfoResponseDto>;

  getUserDoneTests(request: {
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
  }>;

  getTestResultById(id: string): Promise<TestResultInfoResponseDto>;
}
