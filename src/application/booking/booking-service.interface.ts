import { BookingPaymentInfoDto } from './service/dto/booking-payment-info.dto';
import { BookingInfoResponseDto } from './service/dto/booking-info-response.dto';
import { SessionInfoResponseDto } from './service/dto/session-info-response.dto';

export interface IBookingService {
  createBooking(param: {
    therapistServiceId: string;
    userId: string;
    addSession: {
      sessionDate: Date;
      startTime: string;
    };
  }): Promise<BookingInfoResponseDto>;

  getBookingById(bookingId: string): Promise<BookingInfoResponseDto>;

  processBookingPayment(param: {
    userId: string;
    bookingId: string;
    ipAddress: string;
    returnUrl: string;
  }): Promise<BookingPaymentInfoDto>;

  handlePaymentResult(request: {
    paymentGateway: string;
    txnRef: string;
    responseCode: string;
    amount: string;
    currency: string;
    transactionNo: string;
    bankCode?: string;
    payDate: string;
    isSuccessful: boolean;
    message: string;
  }): Promise<string>;

  addTherapySession(request: {
    bookingId: string;
    sessionDate: Date;
    startTime: string;
  }): Promise<SessionInfoResponseDto>;

  getSessionsByBookingId(bookingId: string): Promise<SessionInfoResponseDto[]>;

  cancelTherapySession(sessionId: string): Promise<SessionInfoResponseDto>;

  getTherapySessionsByTherapistId(
    therapistId: string,
    date: Date,
  ): Promise<SessionInfoResponseDto[]>;

  completeTherapySession(sessionId: string): Promise<SessionInfoResponseDto>;
}
