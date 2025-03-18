import { Question } from '../entity/question.entity';
import { AnswerOption } from '../entity/answer-option.entity';

export interface QuestionRepository {
  save(question: Question): Promise<Question>;

  findQuestionById(questionId: string): Promise<Question | null>;

  findQuestionsByTestId(
    testId: string,
    skip: number,
    take: number,
  ): Promise<Question[]>;

  countQuestionsByTestId(testId: string): Promise<number>;

  findAnswerById(answerId: string): Promise<AnswerOption | null>;

  saveAnswerOption(answer: AnswerOption): Promise<AnswerOption>;
}
