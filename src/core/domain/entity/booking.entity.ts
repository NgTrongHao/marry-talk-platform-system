import { ProgressStatus } from './enum/progress-status.enum';
import { Entity } from '../../base/entity';
import { TherapistService } from './therapist-service.entity';
import { ConflictException } from '@nestjs/common';

interface BookingProps {
  id?: string;
  userId: string;
  therapistId: string;
  therapyId: string;
  servicePackageId: string;
  therapistServiceId: string;
  progressStatus?: ProgressStatus;
  createdAt?: Date;
  updatedAt?: Date;
  expiresAt?: Date;
  rating?: number;
  therapistService?: TherapistService;
}

export class Booking extends Entity<BookingProps> {
  private constructor(props: BookingProps) {
    super(props);
  }

  public static create(props: BookingProps): Booking {
    props.id = props.id || Entity.generateId();
    props.progressStatus = ProgressStatus.PENDING;
    props.expiresAt = new Date(Date.now() + 1000 * 60 * 5); // expiresAt in 5 minutes
    return new Booking(props);
  }

  public static changeStatus(
    props: BookingProps,
    status: ProgressStatus,
  ): Booking {
    switch (status) {
      case ProgressStatus.IN_PROGRESS: {
        props.progressStatus = ProgressStatus.IN_PROGRESS;
        props.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90); // expiresAt in 90 days
        break;
      }
      case ProgressStatus.COMPLETED: {
        props.progressStatus = ProgressStatus.COMPLETED;
        // props.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90); // expiresAt in 90 days
        break;
      }
      case ProgressStatus.CANCELLED: {
        props.progressStatus = ProgressStatus.CANCELLED;
        break;
      }
      default: {
        throw new ConflictException('Invalid status');
      }
    }
    return new Booking(props);
  }

  public static rate(props: BookingProps, rating: number): Booking {
    if (rating === undefined) {
      throw new ConflictException('Rating is required');
    } else if (rating < 1 || rating > 5) {
      throw new ConflictException('Invalid rating');
    } else if (rating % 1 !== 0) {
      throw new ConflictException('Rating must be a whole number');
    }
    props.rating = rating;
    return new Booking(props);
  }

  public static build(props: BookingProps): Booking {
    return new Booking(props);
  }

  // Getters
  get id(): string | undefined {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get therapistId(): string {
    return this.props.therapistId;
  }

  get therapyId(): string {
    return this.props.therapyId;
  }

  get servicePackageId(): string {
    return this.props.servicePackageId;
  }

  get therapistServiceId(): string {
    return this.props.therapistServiceId;
  }

  get progressStatus(): ProgressStatus | undefined {
    return this.props.progressStatus;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get expiresAt(): Date | undefined {
    return this.props.expiresAt;
  }

  get rating(): number | undefined {
    return this.props.rating;
  }

  get therapistService(): TherapistService | undefined {
    return this.props.therapistService;
  }

  set progressStatus(status: ProgressStatus) {
    this.props.progressStatus = status;
  }

  set expiresAt(date: Date) {
    this.props.expiresAt = date;
  }

  set therapistService(therapistService: TherapistService) {
    this.props.therapistService = therapistService;
  }

  set rating(rating: number) {
    this.props.rating = rating;
  }
}
