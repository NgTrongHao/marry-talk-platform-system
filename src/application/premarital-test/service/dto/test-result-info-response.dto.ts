import { TestResult } from '../../../../core/domain/entity/test-result.entity';
import { TestQuestionInfoResponseDto } from './test-question-info-response.dto';
import { AnswerOptionInfoResponseDto } from './answer-option-info-response.dto';

export class TestResultInfoResponseDto {
  testId: string;
  testResultId: string;
  userResponses: {
    question: TestQuestionInfoResponseDto;
    selectedAnswers?: AnswerOptionInfoResponseDto[];
    textResponse?: string;
    score: number;
  }[];
  score: number;
  testDate: Date;
  totalTestScore: number;
  percentage: number;

  constructor(testResult: TestResult) {
    this.testId = testResult.testId;
    this.testResultId = testResult.id!;
    this.userResponses = testResult.userResponses.map((response) => ({
      question: new TestQuestionInfoResponseDto(response.question),
      selectedAnswers: response.selectedAnswers?.map(
        (answer) => new AnswerOptionInfoResponseDto(answer),
      ),
      textResponse: response.textResponse || undefined,
      score: response.score,
    }));
    this.score = testResult.score;
    this.testDate = testResult.createdAt!;
    this.totalTestScore = testResult.userResponses.reduce(
      (totalScore, userResponse) => totalScore + userResponse.score,
      0,
    );
    this.percentage = (this.score / this.totalTestScore) * 100;
  }
}
