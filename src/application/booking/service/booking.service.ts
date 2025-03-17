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
    date: Date,
  ): Promise<SessionInfoResponseDto[]> {
    return this.useCaseHandler
      .execute(GetTherapySessionsByTherapistIdUsecase, {
        therapistId,
        date,
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
}
