import { Booking } from '../entity/booking.entity';
import { ProgressStatus } from '../entity/enum/progress-status.enum';

export interface BookingRepository {
  save(booking: Booking): Promise<Booking>;

  findBookingById(bookingId: string): Promise<Booking | null>;

  getTherapistBookings(
    therapistId: string,
    page: number,
    limit: number,
    status: ProgressStatus | undefined,
    from: Date | undefined,
    to: Date | undefined,
  ): Promise<Booking[]>;

  countTherapistBookings(
    therapistId: string,
    status: string | undefined,
    from: Date | undefined,
    to: Date | undefined,
  ): Promise<number>;

  getUserBookings(
    userId: string,
    page: number,
    limit: number,
    status: string | undefined,
    from: Date | undefined,
    to: Date | undefined,
  ): Promise<Booking[]>;

  countUserBookings(
    userId: string,
    status: ProgressStatus | undefined,
    from: Date | undefined,
    to: Date | undefined,
  ): Promise<number>;

  findAllExpiredPendingBookings(): Promise<Booking[]>;

  getReportedBookings(
    userId: string,
    page: number,
    limit: number,
  ): Promise<Booking[]>;

  countTherapistReportedBookings(therapistId: string): Promise<number>;
}
