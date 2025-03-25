import { ProgressStatus } from './enum/progress-status.enum';
import { Booking } from './booking.entity';
import { Entity } from '../../base/entity';

interface SessionProps {
  id?: string;
  sessionNumber: number;
  progressStatus: ProgressStatus;
  sessionDate: Date;
  meetingUrl: string;
  booking: Booking;
  startTime: string;
  endTime: string;
  reported?: boolean;
}

export class Session extends Entity<SessionProps> {
  private constructor(props: SessionProps) {
    super(props);
  }

  public static create(props: SessionProps): Session {
    props.id = props.id || Entity.generateId();
    return new Session(props);
  }

  public static build(props: SessionProps): Session {
    return new Session(props);
  }

  // Getters
  get id(): string | undefined {
    return this.props.id;
  }

  get sessionNumber(): number {
    return this.props.sessionNumber;
  }

  get progressStatus(): ProgressStatus {
    return this.props.progressStatus;
  }

  get sessionDate(): Date {
    return this.props.sessionDate;
  }

  get meetingUrl(): string {
    return this.props.meetingUrl;
  }

  get startTime(): string {
    return this.props.startTime;
  }

  get endTime(): string {
    return this.props.endTime;
  }

  get booking(): Booking {
    return this.props.booking;
  }

  get reported(): boolean {
    return this.props.reported || false;
  }

  set progressStatus(status: ProgressStatus) {
    this.props.progressStatus = status;
  }

  set reported(value: boolean) {
    this.props.reported = value;
  }

  set meetingUrl(url: string) {
    this.props.meetingUrl = url;
  }
}
