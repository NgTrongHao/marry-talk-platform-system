import { Entity } from '../../base/entity';

interface AnswerOptionProps {
  id?: string;
  answer: string;
  score: number;
  questionId: string;
}

export class AnswerOption extends Entity<AnswerOptionProps> {
  private constructor(props: AnswerOptionProps) {
    super(props);
  }

  public static create(props: AnswerOptionProps): AnswerOption {
    return new AnswerOption({
      id: props.id || Entity.generateId(),
      ...props,
    });
  }

  public static build(props: AnswerOptionProps): AnswerOption {
    return new AnswerOption(props);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get answer(): string {
    return this.props.answer;
  }

  get score(): number {
    return this.props.score;
  }

  get questionId(): string {
    return this.props.questionId;
  }

  set answer(answer: string) {
    this.props.answer = answer;
  }

  set score(score: number) {
    this.props.score = score;
  }
}
