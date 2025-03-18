import { Entity } from '../../base/entity';
import { RequestStatus } from './enum/request-status.enum';

interface RefundRequestProps {
  id?: string;
  amount: number;
  currency: string;
  status?: RequestStatus;
  accountNumber: string;
  bankCode: string;
  refundTo: string;
  reportId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class RefundRequest extends Entity<RefundRequestProps> {
  private constructor(props: RefundRequestProps) {
    super(props);
  }

  public static build(props: RefundRequestProps): RefundRequest {
    return new RefundRequest(props);
  }

  static create(props: RefundRequestProps): RefundRequest {
    props.id = props.id || Entity.generateId();
    props.status = RequestStatus.PENDING;
    return new RefundRequest(props);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  get status(): RequestStatus | undefined {
    return this.props.status;
  }

  get accountNumber(): string {
    return this.props.accountNumber;
  }

  get bankCode(): string {
    return this.props.bankCode;
  }

  get refundTo(): string {
    return this.props.refundTo;
  }

  get reportId(): string {
    return this.props.reportId;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  set status(status: RequestStatus) {
    this.props.status = status;
  }
}
