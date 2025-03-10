import { UniqueEntityID } from './unique-entity-id';

export abstract class Entity<Props> {
  public props: Props;

  protected constructor(props: Props) {
    this.props = props;
  }

  static generateId() {
    return new UniqueEntityID().toString();
  }
}
