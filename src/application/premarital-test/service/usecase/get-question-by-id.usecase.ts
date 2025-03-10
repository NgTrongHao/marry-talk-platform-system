import { UseCase } from '../../../usecase.interface';
import { Question } from '../../../../core/domain/entity/question.entity';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { QuestionRepository } from '../../../../core/domain/repository/question.repository';

@Injectable()
export class GetQuestionByIdUsecase implements UseCase<string, Question> {
  constructor(
    @Inject('QuestionRepository')
    private readonly questionRepository: QuestionRepository,
  ) {}

  async execute(questionId: string): Promise<Question> {
    const question = await this.questionRepository.findQuestionById(questionId);

    if (!question) {
      throw new BadRequestException(
        'Question with ' + questionId + ' not found',
      );
    }

    return question;
  }
}
