import { Question } from './question.entity';
import { AnswerOption } from './answer-option.entity';
import { Entity } from '../../base/entity';

interface TestResultProps {
  id?: string;
  testId: string;
  userId: string;
  score: number;
  userResponses: {
    question: Question;
    selectedAnswers: AnswerOption[] | null;
    textResponse: string | null;
    score: number;
  }[];
  createdAt?: Date;
}

export class TestResult extends Entity<TestResultProps> {
  private constructor(props: TestResultProps) {
    super(props);
  }

  public static create(props: TestResultProps): TestResult {
    return new TestResult({
      id: props.id || Entity.generateId(),
      ...props,
    });
  }

  public static build(props: TestResultProps): TestResult {
    return new TestResult(props);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get testId(): string {
    return this.props.testId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get score(): number {
    return this.props.score;
  }

  get userResponses(): {
    question: Question;
    selectedAnswers: AnswerOption[] | null;
    textResponse: string | null;
    score: number;
  }[] {
    return this.props.userResponses;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }
}
