import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { AnswerOption } from '../../../../core/domain/entity/answer-option.entity';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { QuestionRepository } from '../../../../core/domain/repository/question.repository';

interface UpdateAnswerUsecaseCommand {
  answerId: string;
  answer: string;
  score: number;
}

@Injectable()
export class UpdateAnswerUsecase
  implements UseCase<UpdateAnswerUsecaseCommand, AnswerOption>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('QuestionRepository')
    private readonly questionRepository: QuestionRepository,
  ) {}

  async execute(command: UpdateAnswerUsecaseCommand): Promise<AnswerOption> {
    const answer = await this.questionRepository.findAnswerById(
      command.answerId,
    );

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    answer.answer = command.answer;
    answer.score = command.score;
    return await this.questionRepository.saveAnswerOption(answer);
  }
}
