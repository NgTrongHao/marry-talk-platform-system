import { Entity } from '../../base/entity';

interface TherapistServiceProps {
  id?: string;
  therapistId: string;
  therapyCategoryId: string;
  price: number;
  currency: string;
  description?: string;
  packageId?: string;
}

export class TherapistService extends Entity<TherapistServiceProps> {
  private constructor(props: TherapistServiceProps) {
    super(props);
  }

  public static build(props: TherapistServiceProps): TherapistService {
    return new TherapistService(props);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get therapistId(): string {
    return this.props.therapistId;
  }

  get therapyCategoryId(): string {
    return this.props.therapyCategoryId;
  }

  get price(): number {
    return this.props.price;
  }

  get currency(): string {
    return this.props.currency;
  }

  get description(): string | undefined {
    return this.props.description;
  }
}
