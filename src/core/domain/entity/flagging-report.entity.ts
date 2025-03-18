import { RequestStatus } from './enum/request-status.enum';
import { Entity } from '../../base/entity';

interface FlaggingReportProps {
  id?: string;
  reportTitle: string;
  reportBy: string;
  description: string;
  status?: RequestStatus;
  reportReferralId: string;
  createdAt?: Date;
}

export class FlaggingReport extends Entity<FlaggingReportProps> {
  private constructor(props: FlaggingReportProps) {
    super(props);
  }

  static create(props: FlaggingReportProps): FlaggingReport {
    props.id = props.id || Entity.generateId();
    props.status = RequestStatus.PENDING;
    return new FlaggingReport(props);
  }

  public static build(props: FlaggingReportProps): FlaggingReport {
    return new FlaggingReport(props);
  }

  // Getters
  get id(): string | undefined {
    return this.props.id;
  }

  get reportTitle(): string {
    return this.props.reportTitle;
  }

  get reportBy(): string {
    return this.props.reportBy;
  }

  get description(): string {
    return this.props.description;
  }

  get status(): RequestStatus | undefined {
    return this.props.status;
  }

  get reportReferralId(): string {
    return this.props.reportReferralId;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  set status(status: RequestStatus) {
    this.props.status = status;
  }
}
