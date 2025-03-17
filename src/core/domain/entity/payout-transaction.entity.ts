import { TransactionType } from './enum/transaction-type.enum';
import { ReferenceTransactionStatusEnum } from './enum/reference-transaction-status.enum';
import { Entity } from '../../base/entity';

interface PayoutTransactionProps {
  id?: string;
  amount: number;
  currency: string;
  transactionType: TransactionType;
  createdAt?: Date;
  updatedAt?: Date;
  requestId: string;
  referenceTransactionId: string;
  transactionStatus?: ReferenceTransactionStatusEnum;
  changedBy?: string;
  imageUrl: string;
}

export class PayoutTransaction extends Entity<PayoutTransactionProps> {
  private constructor(props: PayoutTransactionProps) {
    super(props);
  }

  public static create(props: PayoutTransactionProps): PayoutTransaction {
    props.id = props.id || Entity.generateId();
    return new PayoutTransaction(props);
  }

  public static build(props: PayoutTransactionProps): PayoutTransaction {
    return new PayoutTransaction(props);
  }

  // Getters
  get id(): string | undefined {
    return this.props.id;
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

  get requestId(): string {
    return this.props.requestId;
  }

  get referenceTransactionId(): string {
    return this.props.referenceTransactionId;
  }

  get transactionStatus(): ReferenceTransactionStatusEnum | undefined {
    return this.props.transactionStatus;
  }

  get changedBy(): string | undefined {
    return this.props.changedBy;
  }

  get imageUrl(): string {
    return this.props.imageUrl;
  }
}
