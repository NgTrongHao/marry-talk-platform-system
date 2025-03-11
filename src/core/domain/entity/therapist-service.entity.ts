import { Entity } from '../../base/entity';
import { ServicePackage } from './service-package.entity';

interface TherapistServiceProps {
  id?: string;
  therapistId: string;
  therapyCategoryId: string;
  price: number;
  currency: string;
  description: string;
  package: ServicePackage;
}

export class TherapistService extends Entity<TherapistServiceProps> {
  private constructor(props: TherapistServiceProps) {
    super(props);
  }

  public static create(props: TherapistServiceProps): TherapistService {
    return new TherapistService({
      id: props.id || Entity.generateId(),
      ...props,
    });
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

  get description(): string {
    return this.props.description;
  }

  get package(): ServicePackage {
    return this.props.package;
  }

  set price(price: number) {
    this.props.price = price;
  }

  set currency(currency: string) {
    this.props.currency = currency;
  }

  set description(description: string) {
    this.props.description = description;
  }
}
