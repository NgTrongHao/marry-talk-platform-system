import { Inject, Injectable } from '@nestjs/common';
import { IBookingService } from '../booking-service.interface';
import { UsecaseHandler } from '../../usecase-handler.service';
import { Booking } from '../../../core/domain/entity/booking.entity';
import { CreateBookingUsecase } from './usecase/create-booking.usecase';
import { ProcessBookingPaymentUsecase } from './usecase/process-booking-payment.usecase';
import { BookingPaymentInfoDto } from './dto/booking-payment-info.dto';
import { HandlePaymentResultUsecase } from './usecase/handle-payment-result.usecase';
import { BookingInfoResponseDto } from './dto/booking-info-response.dto';
import { GetBookingByIdUsecase } from './usecase/get-booking-by-id.usecase';
import { IUsersService } from '../../user/users-service.interface';
import { IServicePackageManagementService } from '../../service-package-management/service-package-management-service.interface';
import { TherapistInfoResponseDto } from '../../user/service/dto/therapist-info-response.dto';
import { AddTherapySessionUsecase } from './usecase/add-therapy-session.usecase';
import { GetSessionsOfBookingUsecase } from './usecase/get-sessions-of-booking.usecase';
import { CancelTherapySessionUsecase } from './usecase/cancel-therapy-session.usecase';
import { SessionInfoResponseDto } from './dto/session-info-response.dto';
import { GetTherapySessionsByTherapistIdUsecase } from './usecase/get-therapy-sessions-by-therapist-id.usecase';
import { CompleteTherapySessionUsecase } from './usecase/complete-therapy-session.usecase';
import { FlaggingReportInfoDto } from './dto/flagging-report-info.dto';
import { CreateSessionReportUsecase } from './usecase/create-session-report.usecase';
import { GetTherapySessionByIdUsecase } from './usecase/get-therapy-session-by-id.usecase';
import { GetAllSessionReportsUsecase } from './usecase/get-all-session-reports.usecase';
import { FlaggingReport } from '../../../core/domain/entity/flagging-report.entity';
import { ApproveSessionReportUsecase } from './usecase/approve-session-report.usecase';
import { RejectSessionReportUsecase } from './usecase/reject-session-report.usecase';
import { GetSessionReportsByUserIdUsecase } from './usecase/get-session-reports-by-user-id.usecase';
import { GetTherapistSessionReportsUsecase } from './usecase/get-therapist-session-reports.usecase';
import { GetSessionReportByIdUsecase } from './usecase/get-session-report-by-id.usecase';
import { Role } from '../../../core/domain/entity/enum/role.enum';
import { GetTherapistBookingsUsecase } from './usecase/get-therapist-bookings.usecase';
import { GetMemberBookingsUsecase } from './usecase/get-member-bookings.usecase';
import { ProgressStatus } from '../../../core/domain/entity/enum/progress-status.enum';
import { CountTherapistBookingsUsecase } from './usecase/count-therapist-bookings.usecase';
import { CountMemberBookingsUsecase } from './usecase/count-member-bookings.usecase';
import { GetTherapySessionByUserIdUsecase } from './usecase/get-therapy-session-by-user-id.usecase';
import { RateBookingUsecase } from './usecase/rate-booking.usecase';
import { CleanupExpiredSessionsUsecase } from './usecase/cleanup-expired-sessions.usecase';
import { AddMeetingLinkSessionUsecase } from './usecase/add-meeting-link-session.usecase';
import { GetTherapistReportedBookingsUsecase } from './usecase/get-therapist-reported-bookings.usecase';
import { CountTherapistReportedBookingsUsecase } from './usecase/count-therapist-reported-bookings.usecase';
import { ReportedBookingInfoDto } from './dto/reported-booking-info.dto';
import { GetMinusAmountReportBookingUsecase } from './usecase/get-minus-amount-report-booking.usecase';

@Injectable()
export class BookingService implements IBookingService {
  constructor(
    private useCaseHandler: UsecaseHandler,
    @Inject('IUsersService') private readonly userService: IUsersService,
    @Inject('IServicePackageManagementService')
    private readonly servicePackageManagementService: IServicePackageManagementService,
  ) {}

  async createBooking(request: {
    therapistServiceId: string;
    userId: string;
    addSession: {
      sessionDate: Date;
      startTime: string;
    };
  }): Promise<BookingInfoResponseDto> {
    return await this.useCaseHandler
      .execute(CreateBookingUsecase, {
        therapistServiceId: request.therapistServiceId,
        userId: request.userId,
        addSession: {
          sessionDate: new Date(request.addSession.sessionDate),
          startTime: request.addSession.startTime,
        },
      })
      .then(async (result: Booking) => {
        const therapist = await this.userService.getUserById({
          userId: result.therapistId,
        });
        return new BookingInfoResponseDto(
          result,
          await this.userService.getUserById({ userId: result.userId }),
          (await this.userService.getUserByUsername({
            username: therapist.username,
          })) as TherapistInfoResponseDto,
          await this.servicePackageManagementService.getTherapistServiceById(
            result.therapistServiceId,
          ),
        );
      });
  }

  async getBookingById(bookingId: string): Promise<BookingInfoResponseDto> {
    return await this.useCaseHandler
      .execute(GetBookingByIdUsecase, bookingId)
      .then(async (result: Booking) => {
        const therapist = await this.userService.getUserById({
          userId: result.therapistId,
        });
        return new BookingInfoResponseDto(
          result,
          await this.userService.getUserById({ userId: result.userId }),
          (await this.userService.getUserByUsername({
            username: therapist.username,
          })) as TherapistInfoResponseDto,
          await this.servicePackageManagementService.getTherapistServiceById(
            result.therapistServiceId,
          ),
        );
      });
  }

  processBookingPayment(request: {
    userId: string;
    bookingId: string;
    ipAddress: string;
    returnUrl: string;
  }): Promise<BookingPaymentInfoDto> {
    return this.useCaseHandler.execute(ProcessBookingPaymentUsecase, {
      userId: request.userId,
      bookingId: request.bookingId,
      ipAddress: request.ipAddress,
      returnUrl: request.returnUrl,
    });
  }

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
  }): Promise<string> {
    return this.useCaseHandler.execute(HandlePaymentResultUsecase, request);
  }

  async addTherapySession(request: {
    bookingId: string;
    sessionDate: Date;
    startTime: string;
  }): Promise<SessionInfoResponseDto> {
    return this.useCaseHandler
      .execute(AddTherapySessionUsecase, {
        bookingId: request.bookingId,
        sessionDate: new Date(request.sessionDate),
        startTime: request.startTime,
      })
      .then(async (result) => {
        return new SessionInfoResponseDto(
          result,
          await this.getBookingById(result.booking.id!),
        );
      });
  }

  async getSessionsByBookingId(
    bookingId: string,
  ): Promise<SessionInfoResponseDto[]> {
    const results = await this.useCaseHandler.execute(
      GetSessionsOfBookingUsecase,
      bookingId,
    );
    return Promise.all(
      results.map(async (result) => {
        return new SessionInfoResponseDto(
          result,
          await this.getBookingById(result.booking.id!),
        );
      }),
    );
  }

  async cancelTherapySession(
    sessionId: string,
  ): Promise<SessionInfoResponseDto> {
    return this.useCaseHandler
      .execute(CancelTherapySessionUsecase, sessionId)
      .then(async (result) => {
        return new SessionInfoResponseDto(
          result,
          await this.getBookingById(result.booking.id!),
        );
      });
  }

  async getTherapySessionsByTherapistId(
    therapistId: string,
    status?: ProgressStatus,
    from?: Date,
    to?: Date,
  ): Promise<SessionInfoResponseDto[]> {
    return this.useCaseHandler
      .execute(GetTherapySessionsByTherapistIdUsecase, {
        therapistId,
        status,
        from,
        to,
      })
      .then(async (results) => {
        return Promise.all(
          results.map(async (result) => {
            return new SessionInfoResponseDto(
              result,
              await this.getBookingById(result.booking.id!),
            );
          }),
        );
      });
  }

  async completeTherapySession(
    sessionId: string,
  ): Promise<SessionInfoResponseDto> {
    return this.useCaseHandler
      .execute(CompleteTherapySessionUsecase, sessionId)
      .then(async (result) => {
        return new SessionInfoResponseDto(
          result,
          await this.getBookingById(result.booking.id!),
        );
      });
  }

  async flagSessionReport(request: {
    sessionId: string;
    userId: string;
    flagReport: { reportTitle: string; description: string };
  }): Promise<FlaggingReportInfoDto> {
    return this.useCaseHandler
      .execute(CreateSessionReportUsecase, {
        sessionId: request.sessionId,
        reportBy: request.userId,
        reportTitle: request.flagReport.reportTitle,
        description: request.flagReport.description,
        userId: request.userId,
      })
      .then(async (result) => {
        return new FlaggingReportInfoDto(
          result,
          await this.userService.getUserById({ userId: result.reportBy }),
          await this.useCaseHandler
            .execute(GetTherapySessionByIdUsecase, result.reportReferralId)
            .then(async (sessionResult) => {
              return new SessionInfoResponseDto(
                sessionResult,
                await this.getBookingById(sessionResult.booking.id!),
              );
            }),
        );
      });
  }

  async getAllSessionReports(request: {
    page: number;
    limit: number;
    status: string | undefined;
  }): Promise<FlaggingReportInfoDto[]> {
    return this.useCaseHandler
      .execute(GetAllSessionReportsUsecase, request)
      .then((results) => {
        return Promise.all(
          results.map(async (result) => this.mapFlaggingReportInfoDto(result)),
        );
      });
  }

  async reviewFlagReport(request: {
    reportId: string;
    approve: boolean;
  }): Promise<FlaggingReportInfoDto> {
    let report: FlaggingReport;
    if (request.approve) {
      report = await this.useCaseHandler.execute(
        ApproveSessionReportUsecase,
        request.reportId,
      );
    } else {
      report = await this.useCaseHandler.execute(
        RejectSessionReportUsecase,
        request.reportId,
      );
    }

    return new FlaggingReportInfoDto(
      report,
      await this.userService.getUserById({ userId: report.reportBy }),
      await this.useCaseHandler
        .execute(GetTherapySessionByIdUsecase, report.reportReferralId)
        .then(async (sessionResult) => {
          return new SessionInfoResponseDto(
            sessionResult,
            await this.getBookingById(sessionResult.booking.id!),
          );
        }),
    );
  }

  async getSessionReportsByUserId(request: {
    page: number;
    limit: number;
    status: string | undefined;
    userId: string;
  }): Promise<FlaggingReportInfoDto[]> {
    return this.useCaseHandler
      .execute(GetSessionReportsByUserIdUsecase, request)
      .then(async (results) => {
        return Promise.all(
          results.map(async (result) => this.mapFlaggingReportInfoDto(result)),
        );
      });
  }

  async getTherapistSessionReports(request: {
    page: number;
    limit: number;
    status: string | undefined;
    therapistId: string;
  }): Promise<FlaggingReportInfoDto[]> {
    return this.useCaseHandler
      .execute(GetTherapistSessionReportsUsecase, request)
      .then(async (results) => {
        return Promise.all(
          results.map(async (result) => this.mapFlaggingReportInfoDto(result)),
        );
      });
  }

  async getSessionReportById(reportId: string): Promise<FlaggingReportInfoDto> {
    return this.useCaseHandler
      .execute(GetSessionReportByIdUsecase, reportId)
      .then(async (result) => {
        return new FlaggingReportInfoDto(
          result,
          await this.userService.getUserById({ userId: result.reportBy }),
          await this.useCaseHandler
            .execute(GetTherapySessionByIdUsecase, result.reportReferralId)
            .then(async (sessionResult) => {
              return new SessionInfoResponseDto(
                sessionResult,
                await this.getBookingById(sessionResult.booking.id!),
              );
            }),
        );
      });
  }

  private async mapFlaggingReportInfoDto(
    result: FlaggingReport,
  ): Promise<FlaggingReportInfoDto> {
    return new FlaggingReportInfoDto(
      result,
      await this.userService.getUserById({ userId: result.reportBy }),
      await this.useCaseHandler
        .execute(GetTherapySessionByIdUsecase, result.reportReferralId)
        .then(async (sessionResult) => {
          return new SessionInfoResponseDto(
            sessionResult,
            await this.getBookingById(sessionResult.booking.id!),
          );
        }),
    );
  }

  async getBookingByUser(
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
  }> {
    let bookings: Booking[];
    let total: number;
    if (role === Role.THERAPIST.toString()) {
      bookings = await this.useCaseHandler.execute(
        GetTherapistBookingsUsecase,
        {
          therapistId: userId,
          page: param.page,
          limit: param.limit,
          status: param.status,
          fromDate: param.fromDate,
          toDate: param.toDate,
        },
      );
      total = await this.useCaseHandler.execute(CountTherapistBookingsUsecase, {
        therapistId: userId,
        status: param.status,
      });
    } else {
      bookings = await this.useCaseHandler.execute(GetMemberBookingsUsecase, {
        memberId: userId,
        page: param.page,
        limit: param.limit,
        status: param.status,
        fromDate: param.fromDate,
        toDate: param.toDate,
      });
      total = await this.useCaseHandler.execute(CountMemberBookingsUsecase, {
        memberId: userId,
        status: param.status,
      });
    }
    return {
      bookings: await Promise.all(
        bookings.map(async (booking) => {
          const therapist = await this.userService.getUserById({
            userId: booking.therapistId,
          });

          return new BookingInfoResponseDto(
            booking,
            await this.userService.getUserById({ userId: booking.userId }),
            (await this.userService.getUserByUsername({
              username: therapist.username,
            })) as TherapistInfoResponseDto,
            await this.servicePackageManagementService.getTherapistServiceById(
              booking.therapistServiceId,
            ),
          );
        }),
      ),
      limit: param.limit,
      page: param.page,
      total,
      totalPages: Math.ceil(total / param.limit),
    };
  }

  async getTherapySessionsByUserId(
    userId: string,
    page: number,
    limit: number,
    from: Date | undefined,
    to: Date | undefined,
    status: ProgressStatus | undefined,
  ): Promise<{
    sessions: SessionInfoResponseDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }> {
    const total = await this.useCaseHandler.execute(
      CountTherapistBookingsUsecase,
      {
        therapistId: userId,
        from: from,
        to: to,
        status: status,
      },
    );
    return {
      sessions: await this.useCaseHandler
        .execute(GetTherapySessionByUserIdUsecase, {
          userId,
          page,
          limit,
          from,
          to,
          status,
        })
        .then(async (results) => {
          return Promise.all(
            results.map(async (result) => {
              return new SessionInfoResponseDto(
                result,
                await this.getBookingById(result.booking.id!),
              );
            }),
          );
        }),
      page,
      limit,
      total: total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async rateBooking(
    bookingId: string,
    userId: string,
    request: { rating: number },
  ): Promise<BookingInfoResponseDto> {
    return this.useCaseHandler
      .execute(RateBookingUsecase, {
        bookingId: bookingId,
        userId: userId,
        rating: request.rating,
      })
      .then(async (result: Booking) => {
        const therapist = await this.userService.getUserById({
          userId: result.therapistId,
        });
        return new BookingInfoResponseDto(
          result,
          await this.userService.getUserById({ userId: result.userId }),
          (await this.userService.getUserByUsername({
            username: therapist.username,
          })) as TherapistInfoResponseDto,
          await this.servicePackageManagementService.getTherapistServiceById(
            result.therapistServiceId,
          ),
        );
      });
  }

  async cleanupExpiredPendingSessionBookings(): Promise<void> {
    await this.useCaseHandler.execute(CleanupExpiredSessionsUsecase, {});
  }

  async addMeetingUrlToSession(
    sessionId: string,
    meetingLink: string,
  ): Promise<SessionInfoResponseDto> {
    return this.useCaseHandler
      .execute(AddMeetingLinkSessionUsecase, {
        meetingLink: meetingLink,
        sessionId: sessionId,
      })
      .then(async (result) => {
        return new SessionInfoResponseDto(
          result,
          await this.getBookingById(result.booking.id!),
        );
      });
  }

  async getTherapistReportedBookings(
    therapistId: string,
    page: number,
    limit: number,
  ): Promise<{
    bookings: ReportedBookingInfoDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }> {
    const total = await this.useCaseHandler.execute(
      CountTherapistReportedBookingsUsecase,
      therapistId,
    );
    return {
      bookings: await this.useCaseHandler
        .execute(GetTherapistReportedBookingsUsecase, {
          userId: therapistId,
          page,
          limit,
        })
        .then(async (results) => {
          return Promise.all(
            results.map(async (result) => {
              const therapist = await this.userService.getUserById({
                userId: result.therapistId,
              });

              return new ReportedBookingInfoDto(
                result,
                await this.userService.getUserById({ userId: result.userId }),
                (await this.userService.getUserByUsername({
                  username: therapist.username,
                })) as TherapistInfoResponseDto,
                await this.servicePackageManagementService.getTherapistServiceById(
                  result.therapistServiceId,
                ),
                await this.useCaseHandler.execute(
                  GetMinusAmountReportBookingUsecase,
                  result.id,
                ),
              );
            }),
          );
        }),
      limit,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
