import { Entity } from '../../base/entity';
import { RequestStatus } from './enum/request-status.enum';
import { BadRequestException } from '@nestjs/common';

interface WithdrawRequestProps {
  id?: string;
  therapistId: string;
  amount: number;
  currency: string;
  status?: RequestStatus;
  createdAt?: Date;
  updatedAt?: Date;
  payoutAccountId: string;
}

export class WithdrawRequest extends Entity<WithdrawRequestProps> {
  private constructor(props: WithdrawRequestProps) {
    super(props);
  }

  static create(props: WithdrawRequestProps): WithdrawRequest {
    if (props.amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }
    props.id = props.id || Entity.generateId();
    props.status = RequestStatus.PENDING;
    props.currency = props.currency ?? 'VND';
    return new WithdrawRequest(props);
  }

  public static build(props: WithdrawRequestProps): WithdrawRequest {
    return new WithdrawRequest(props);
  }

  // Getters
  get id(): string | undefined {
    return this.props.id;
  }

  get therapistId(): string {
    return this.props.therapistId;
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

  get payoutAccountId(): string {
    return this.props.payoutAccountId;
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
