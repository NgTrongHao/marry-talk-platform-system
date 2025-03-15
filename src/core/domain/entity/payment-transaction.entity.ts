import { TransactionType } from './enum/transaction-type.enum';
import { Entity } from '../../base/entity';
import { Booking } from './booking.entity';
import { ReferenceTransactionStatusEnum } from './enum/reference-transaction-status.enum';

interface PaymentTransactionProps {
  id?: string;
  booking: Booking;
  amount: number;
  currency: string;
  transactionType: TransactionType;
  createdAt?: Date;
  updatedAt?: Date;
  referenceTransactionId: string;
  returnUrl?: string;
  transactionStatus?: ReferenceTransactionStatusEnum;
  changedBy?: string;
}

export class PaymentTransaction extends Entity<PaymentTransactionProps> {
  private constructor(props: PaymentTransactionProps) {
    super(props);
  }

  public static create(props: PaymentTransactionProps): PaymentTransaction {
    props.id = props.id || Entity.generateId();
    props.transactionType = TransactionType.PAYMENT;
    return new PaymentTransaction(props);
  }

  public static build(props: PaymentTransactionProps): PaymentTransaction {
    return new PaymentTransaction(props);
  }

  // Getters
  get id(): string | undefined {
    return this.props.id;
  }

  get booking(): Booking {
    return this.props.booking;
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  get transactionType(): TransactionType {
    return this.props.transactionType;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get referenceTransactionId(): string {
    return this.props.referenceTransactionId;
  }

  get returnUrl(): string | undefined {
    return this.props.returnUrl;
  }

  get transactionStatus(): ReferenceTransactionStatusEnum | undefined {
    return this.props.transactionStatus;
  }

  get changedBy(): string | undefined {
    return this.props.changedBy;
  }
}
