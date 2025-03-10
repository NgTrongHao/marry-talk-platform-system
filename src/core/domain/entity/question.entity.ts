import { Entity } from '../../base/entity';
import { AnswerOption } from './answer-option.entity';
import { QuestionType } from './enum/question-type.enum';
import { ConflictException } from '@nestjs/common';

interface QuestionProps {
  id?: string;
  questionText: string;
  type: QuestionType;
  questionNo: number;
  testId: string;
  answerOptions?: AnswerOption[];
}

export class Question extends Entity<QuestionProps> {
  private constructor(props: QuestionProps) {
    super(props);
  }

  public static create(props: QuestionProps): Question {
    return new Question({
      id: props.id || Entity.generateId(),
      ...props,
    });
  }

  public static build(props: QuestionProps): Question {
    return new Question(props);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get questionText(): string {
    return this.props.questionText;
  }

  get type(): QuestionType {
    return this.props.type;
  }

  get questionNo(): number {
    return this.props.questionNo;
  }

  get testId(): string {
    return this.props.testId;
  }

  get answerOptions(): AnswerOption[] | undefined {
    return this.props.answerOptions;
  }

  addAnswerOption(option: AnswerOption) {
    if (
      this.type !== QuestionType.MULTIPLE_CHOICE &&
      this.type !== QuestionType.SINGLE_CHOICE
    ) {
      throw new ConflictException(
        'Cannot add answer option to question of type ' + this.type,
      );
    }
    if (!this.props.answerOptions) {
      this.props.answerOptions = [];
    }
    this.props.answerOptions.push(option);
  }
}
