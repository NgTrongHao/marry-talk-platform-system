import { Entity } from '../../base/entity';
import { Question } from './question.entity';

interface PremaritalTestProps {
  id?: string;
  name: string;
  description: string;
  therapyCategories: string[];
  createdAt?: Date;
  updatedAt?: Date;
  questions?: Question[];
}

export class PremaritalTest extends Entity<PremaritalTestProps> {
  private constructor(props: PremaritalTestProps) {
    super(props);
  }

  public static create(props: PremaritalTestProps): PremaritalTest {
    return new PremaritalTest({
      id: props.id || Entity.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...props,
    });
  }

  public static build(props: PremaritalTestProps): PremaritalTest {
    return new PremaritalTest(props);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get therapyCategories(): string[] {
    return this.props.therapyCategories;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get questions(): Question[] | undefined {
    return this.props.questions;
  }

  addQuestion(question: Question) {
    if (!this.props.questions) {
      this.props.questions = [];
    }
    this.props.questions.push(question);
  }

  set name(name: string) {
    this.props.name = name;
  }

  set description(description: string) {
    this.props.description = description;
  }

  set therapyCategories(therapyCategories: string[]) {
    this.props.therapyCategories = therapyCategories;
  }
}
