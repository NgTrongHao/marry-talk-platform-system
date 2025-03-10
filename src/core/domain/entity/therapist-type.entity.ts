import { Entity } from '../../base/entity';

interface TherapistTypeProps {
  therapistId: string;
  therapyCategoryId: string;
  enable: boolean;
}

export class TherapistType extends Entity<TherapistTypeProps> {
  private constructor(props: TherapistTypeProps) {
    super(props);
  }

  public static build(props: TherapistTypeProps): TherapistType {
    return new TherapistType(props);
  }

  get therapistId(): string {
    return this.props.therapistId;
  }

  get therapyCategoryId(): string {
    return this.props.therapyCategoryId;
  }

  get enable(): boolean {
    return this.props.enable;
  }

  set enable(enable: boolean) {
    this.props.enable = enable;
  }
}
