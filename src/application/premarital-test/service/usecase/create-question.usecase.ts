import { Question } from '../../../../core/domain/entity/question.entity';
import { AnswerOption } from '../../../../core/domain/entity/answer-option.entity';
import { QuestionRepository } from '../../../../core/domain/repository/question.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { QuestionType } from '../../../../core/domain/entity/enum/question-type.enum';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { GetTestByIdUsecase } from './get-test-by-id.usecase';

export interface CreateQuestionUsecaseCommand {
  premaritalTestId: string;
  question: string;
  questionType: QuestionType;
  questionNo: number;
  answers?: {
    answer: string;
    score: number;
  }[];
}

@Injectable()
export class CreateQuestionUsecase
  implements UseCase<CreateQuestionUsecaseCommand, Question>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('QuestionRepository')
    private readonly questionRepository: QuestionRepository,
  ) {}

  async execute(command: CreateQuestionUsecaseCommand): Promise<Question> {
    const test = await this.usecaseHandler.execute(
      GetTestByIdUsecase,
      command.premaritalTestId,
    );

    if (!test) {
      throw new NotFoundException(
        'Test with ' + command.premaritalTestId + ' not found',
      );
    }

    const question = Question.create({
      questionText: command.question,
      type: command.questionType,
      questionNo: command.questionNo,
      testId: command.premaritalTestId,
    });

    if (command.answers) {
      command.answers.forEach((answer) => {
        question.addAnswerOption(
          AnswerOption.create({
            answer: answer.answer,
            score: answer.score,
            questionId: question.id!,
          }),
        );
      });
    }

    return await this.questionRepository.save(question);
  }
}
