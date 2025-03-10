import { UseCase } from '../../../usecase.interface';
import { Inject, Injectable } from '@nestjs/common';
import { QuestionRepository } from '../../../../core/domain/repository/question.repository';

@Injectable()
export class CountQuestionsOfTestUsecase implements UseCase<string, number> {
  constructor(
    @Inject('QuestionRepository')
    private readonly questionRepository: QuestionRepository,
  ) {}

  async execute(testId: string): Promise<number> {
    return this.questionRepository.countQuestionsByTestId(testId);
  }
}
