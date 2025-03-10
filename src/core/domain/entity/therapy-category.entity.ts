import { Entity } from '../../base/entity';

interface TherapyCategoryProps {
  id?: string;
  name: string;
  description: string;
  enabled?: boolean;
}

export class TherapyCategory extends Entity<TherapyCategoryProps> {
  private constructor(props: TherapyCategoryProps) {
    super(props);
  }

  public static create(props: TherapyCategoryProps): TherapyCategory {
    return new TherapyCategory({
      id: props.id || Entity.generateId(),
      enabled: true,
      ...props,
    });
  }

  public static build(props: TherapyCategoryProps): TherapyCategory {
    return new TherapyCategory(props);
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

  get enabled(): boolean | undefined {
    return this.props.enabled;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set description(description: string) {
    this.props.description = description;
  }

  set enabled(enable: boolean) {
    this.props.enabled = enable;
  }
}
