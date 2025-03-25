import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IBookingService } from '../../../application/booking/booking-service.interface';
import { JwtAuthGuard } from '../../../infrastructure/security/guard/jwt-auth.guard';
import { BaseResponseDto } from '../../dto/base-response.dto';
import { CurrentUser } from '../../../infrastructure/security/decorator/current-user.decorator';
import { TokenPayload } from '../../../application/user/service/token.service';
import { PaymentSupportService } from '../../../application/booking/service/payment-support.service';
import { Request, Response } from 'express';
import { ProcessBookingPaymentDto } from '../../dto/booking/process-booking-payment-request.dto';
import { IVnpayService } from '../../../infrastructure/external/payment/vnPay/modules/vnpay.interface';
import { AddTherapySessionRequestDto } from '../../dto/booking/add-therapy-session-request.dto';
import { ProgressStatus } from '../../../core/domain/entity/enum/progress-status.enum';
import { RatingBookingRequestDto } from '../../dto/booking/rating-booking.request.dto';

@Controller('booking')
@ApiTags('Booking')
export class BookingController {
  constructor(
    @Inject('IBookingService') private readonly bookingService: IBookingService,
    @Inject('PaymentSupportService')
    private readonly paymentSupportService: PaymentSupportService,
    @Inject('IVnpayService') private readonly vnpayService: IVnpayService,
  ) {}

  @Post('create/:therapistServiceId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create Booking REST API',
    description: 'Create Booking REST API is used to create a booking.',
  })
  @ApiResponse({ status: 201, description: 'Created' })
  async createBooking(
    @Param('therapistServiceId') therapistServiceId: string,
    @CurrentUser() info: TokenPayload,
    @Body() request: AddTherapySessionRequestDto,
  ) {
    return await this.bookingService
      .createBooking({
        therapistServiceId,
        userId: info.userId,
        addSession: request,
      })
      .then((result) => new BaseResponseDto(201, result));
  }

  @Get('get-booking-by-id/:bookingId')
  @ApiOperation({
    summary: 'Get Booking By Id REST API',
    description: 'Get Booking By Id REST API is used to get a booking by id.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async getBookingById(@Param('bookingId') bookingId: string) {
    return await this.bookingService
      .getBookingById(bookingId)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('get-booking-by-user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Booking By User REST API',
    description: 'Get Booking By User REST API is used to get booking by user.',
  })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
  @ApiQuery({ name: 'status', required: false, example: 'PENDING' })
  @ApiQuery({
    name: 'fromDate',
    required: false,
    description: 'Date in YYYY-MM-DD format',
  })
  @ApiQuery({
    name: 'toDate',
    required: false,
    description: 'Date in YYYY-MM-DD format',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async getBookingByUser(
    @CurrentUser() info: TokenPayload,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status?: ProgressStatus,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    if (status && !Object.values(ProgressStatus).includes(status)) {
      throw new BadRequestException({
        statusCode: 400,
        message: `Invalid status value: ${status}. Allowed values: ${Object.values(ProgressStatus).join(', ')}`,
        error: 'Bad Request',
      });
    }
    const parsedFromDate = fromDate ? new Date(fromDate) : undefined;
    const parsedToDate = toDate ? new Date(toDate) : undefined;

    if (parsedFromDate && parsedToDate && parsedFromDate > parsedToDate) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'fromDate must be less than or equal to toDate',
        error: 'Bad Request',
      });
    }
    return await this.bookingService
      .getBookingByUser(info.userId, info.role, {
        page,
        limit,
        status,
        fromDate: parsedFromDate,
        toDate: parsedToDate,
      })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Patch('rate-booking/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Rate Booking REST API',
    description: 'Rate Booking REST API is used to rate a booking.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async rateBooking(
    @Param('bookingId') bookingId: string,
    @CurrentUser() info: TokenPayload,
    @Body() request: RatingBookingRequestDto,
  ) {
    return await this.bookingService
      .rateBooking(bookingId, info.userId, request)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Post('vnpay/process-booking-payment/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Process Booking Payment REST API',
    description:
      'Process Booking Payment REST API is used to process booking payment.',
  })
  @ApiResponse({ status: 200, description: 'Return payment URL' })
  async processBookingPayment(
    @Param('bookingId') bookingId: string,
    @Body() request: ProcessBookingPaymentDto,
    @CurrentUser() info: TokenPayload,
    @Req() req: Request,
  ) {
    const ipAddress: string = req.ip!;
    return await this.paymentSupportService.buildPaymentUrl({
      userId: info.userId,
      bookingId,
      ipAddress,
      returnUrl: request.returnUrl,
    });
  }

  @Get('vnpay/callback')
  @ApiOperation({
    summary: 'VNPay Callback REST API (FE do not call this API)',
    description:
      'VNPay Callback REST API is endpoint for VNPay callback (FE do not call this API)',
  })
  async vnpayCallback(@Query() vnpayResponse: any, @Res() res: Response) {
    const url = await this.paymentSupportService.paymentCallback(vnpayResponse);
    return res.redirect(url);
  }

  @Get('vnpay/get-all-banks')
  @ApiOperation({
    summary: 'Get All Banks REST API',
    description: 'Get All Banks REST API is used to get all banks.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async getAllBanks() {
    const bankList = await this.vnpayService.getBankList();
    return new BaseResponseDto(200, bankList);
  }
}
