import { UseCase } from '../../../usecase.interface';
import { Question } from '../../../../core/domain/entity/question.entity';
import { Inject, Injectable } from '@nestjs/common';
import { QuestionRepository } from '../../../../core/domain/repository/question.repository';
import { AnswerOption } from '../../../../core/domain/entity/answer-option.entity';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { GetQuestionByIdUsecase } from './get-question-by-id.usecase';

export interface AddAnswerToQuestionUsecaseCommand {
  questionId: string;
  answer: string;
  score: number;
}

@Injectable()
export class AddAnswerToQuestionUsecase
  implements UseCase<AddAnswerToQuestionUsecaseCommand, Question>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('QuestionRepository')
    private readonly questionRepository: QuestionRepository,
  ) {}

  async execute(command: AddAnswerToQuestionUsecaseCommand): Promise<Question> {
    const question = await this.usecaseHandler.execute(
      GetQuestionByIdUsecase,
      command.questionId,
    );

    const answer = AnswerOption.build({
      answer: command.answer,
      score: command.score,
      questionId: question.id!,
    });

    question.addAnswerOption(answer);

    return await this.questionRepository.save(question);
  }
}
