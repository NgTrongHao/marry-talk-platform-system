import { Entity } from '../../base/entity';

interface TherapistBalanceProps {
  therapistId: string;
  balance: number;
  updatedAt?: Date;
}

export class TherapistBalance extends Entity<TherapistBalanceProps> {
  private constructor(props: TherapistBalanceProps) {
    super(props);
  }

  static create(therapistId: string): TherapistBalance {
    return new TherapistBalance({
      therapistId,
      balance: 0,
    });
  }

  increase(amount: number): TherapistBalance {
    if (amount <= 0) {
      throw new Error('Increase amount must be greater than zero.');
    }

    return new TherapistBalance({
      therapistId: this.therapistId,
      balance: this.balance + amount,
      updatedAt: new Date(),
    });
  }

  decrease(amount: number): TherapistBalance {
    if (amount <= 0) {
      throw new Error('Decrease amount must be greater than zero.');
    }
    if (this.balance < amount) {
      throw new Error('Insufficient balance.');
    }

    return new TherapistBalance({
      therapistId: this.therapistId,
      balance: this.balance - amount,
      updatedAt: new Date(),
    });
  }

  public static build(props: TherapistBalanceProps): TherapistBalance {
    return new TherapistBalance(props);
  }

  // Getters
  get therapistId(): string {
    return this.props.therapistId;
  }

  get balance(): number {
    return this.props.balance;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
