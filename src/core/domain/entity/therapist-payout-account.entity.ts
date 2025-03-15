import { Entity } from '../../base/entity';

interface TherapistPayoutAccountProps {
  id?: string;
  therapistId: string;
  accountNumber: string;
  bankCode?: string;
  accountName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TherapistPayoutAccount extends Entity<TherapistPayoutAccountProps> {
  private constructor(props: TherapistPayoutAccountProps) {
    super(props);
  }

  static create(props: TherapistPayoutAccountProps): TherapistPayoutAccount {
    props.id = props.id || Entity.generateId();
    return new TherapistPayoutAccount(props);
  }

  public static build(
    props: TherapistPayoutAccountProps,
  ): TherapistPayoutAccount {
    return new TherapistPayoutAccount(props);
  }

  // Getters
  get id(): string | undefined {
    return this.props.id;
  }

  get therapistId(): string {
    return this.props.therapistId;
  }

  get accountNumber(): string {
    return this.props.accountNumber;
  }

  get bankCode(): string | undefined {
    return this.props.bankCode;
  }

  get accountName(): string | undefined {
    return this.props.accountName;
  }
}
