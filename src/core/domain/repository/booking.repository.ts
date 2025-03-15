import { Booking } from '../entity/booking.entity';

export interface BookingRepository {
  save(booking: Booking): Promise<Booking>;

  findBookingById(bookingId: string): Promise<Booking | null>;
}
