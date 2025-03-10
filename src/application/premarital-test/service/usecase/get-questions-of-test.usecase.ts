import { UseCase } from '../../../usecase.interface';
import { Question } from '../../../../core/domain/entity/question.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { QuestionRepository } from '../../../../core/domain/repository/question.repository';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { GetTestByIdUsecase } from './get-test-by-id.usecase';

export interface GetQuestionsOfTestUsecaseCommand {
  testId: string;
  take: number;
  skip: number;
}

@Injectable()
export class GetQuestionsOfTestUsecase
  implements UseCase<GetQuestionsOfTestUsecaseCommand, Question[]>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('QuestionRepository')
    private readonly questionRepository: QuestionRepository,
  ) {}

  async execute(
    command: GetQuestionsOfTestUsecaseCommand,
  ): Promise<Question[]> {
    const test = await this.usecaseHandler.execute(
      GetTestByIdUsecase,
      command.testId,
    );

    if (!test) {
      throw new NotFoundException('Test with ' + command.testId + ' not found');
    }

    return this.questionRepository.findQuestionsByTestId(
      command.testId,
      command.skip,
      command.take,
    );
  }
}
