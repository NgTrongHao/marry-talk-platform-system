import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { Question } from '../../../../core/domain/entity/question.entity';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { QuestionRepository } from '../../../../core/domain/repository/question.repository';

interface UpdateQuestionUsecaseCommand {
  questionId: string;
  questionName: string;
}

@Injectable()
export class UpdateQuestionUsecase
  implements UseCase<UpdateQuestionUsecaseCommand, Question>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('QuestionRepository')
    private readonly questionRepository: QuestionRepository,
  ) {}

  async execute(command: UpdateQuestionUsecaseCommand): Promise<Question> {
    const question = await this.questionRepository.findQuestionById(
      command.questionId,
    );

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    question.questionText = command.questionName;
    return await this.questionRepository.save(question);
  }
}
