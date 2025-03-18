import { BookingPaymentInfoDto } from './service/dto/booking-payment-info.dto';
import { BookingInfoResponseDto } from './service/dto/booking-info-response.dto';
import { SessionInfoResponseDto } from './service/dto/session-info-response.dto';
import { FlaggingReportInfoDto } from './service/dto/flagging-report-info.dto';
import { ProgressStatus } from '../../core/domain/entity/enum/progress-status.enum';

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

  flagSessionReport(param: {
    sessionId: string;
    userId: string;
    flagReport: {
      reportTitle: string;
      description: string;
    };
  }): Promise<FlaggingReportInfoDto>;

  getAllSessionReports(request: {
    page: number;
    limit: number;
    status: string | undefined;
  }): Promise<FlaggingReportInfoDto[]>;

  reviewFlagReport(request: {
    reportId: string;
    approve: boolean;
  }): Promise<FlaggingReportInfoDto>;

  getSessionReportsByUserId(request: {
    page: number;
    limit: number;
    status: string | undefined;
    userId: string;
  }): Promise<FlaggingReportInfoDto[]>;

  getTherapistSessionReports(request: {
    page: number;
    limit: number;
    status: string | undefined;
    therapistId: string;
  }): Promise<FlaggingReportInfoDto[]>;

  getSessionReportById(reportId: string): Promise<FlaggingReportInfoDto>;

  getBookingByUser(
    userId: string,
    role: string,
    param: {
      page: number;
      limit: number;
      status: ProgressStatus | undefined;
      fromDate: Date | undefined;
      toDate: Date | undefined;
    },
  ): Promise<{
    bookings: BookingInfoResponseDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>;

  getTherapySessionsByUserId(
    userId: string,
    page: number,
    limit: number,
    from: Date | undefined,
    to: Date | undefined,
    status: string | undefined,
  ): Promise<{
    sessions: SessionInfoResponseDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>;

  rateBooking(
    bookingId: string,
    userId: string,
    request: { rating: number },
  ): Promise<BookingInfoResponseDto>;
}
