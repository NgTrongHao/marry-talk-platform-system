import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IBookingService } from '../../application/booking/booking-service.interface';
import { JwtAuthGuard } from '../../infrastructure/security/guard/jwt-auth.guard';
import { BaseResponseDto } from '../dto/base-response.dto';
import { CurrentUser } from '../../infrastructure/security/decorator/current-user.decorator';
import { TokenPayload } from '../../application/user/service/token.service';
import { AddTherapySessionRequestDto } from '../dto/booking/add-therapy-session-request.dto';

@Controller('booking')
@ApiTags('Booking')
export class BookingController {
  constructor(
    @Inject('IBookingService') private readonly bookingService: IBookingService,
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
  ) {
    return await this.bookingService
      .createBooking({ therapistServiceId, userId: info.userId })
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

  @Post('add-therapy-session/:bookingId')
  @ApiOperation({
    summary: 'Add Therapy Session REST API',
    description:
      'Add Therapy Session REST API is used to add a therapy session.',
  })
  @ApiResponse({ status: 201, description: 'Created' })
  async addTherapySession(
    @Param('bookingId') bookingId: string,
    @Body() request: AddTherapySessionRequestDto,
  ) {
    return await this.bookingService
      .addTherapySession({
        bookingId,
        sessionDate: request.sessionDate,
        startTime: request.startTime,
      })
      .then((result) => new BaseResponseDto(201, result));
  }

  @Get('get-sessions-by-booking-id/:bookingId')
  @ApiOperation({
    summary: 'Get Sessions By Booking Id REST API',
    description:
      'Get Sessions By Booking Id REST API is used to get sessions by booking id.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async getSessionsByBookingId(@Param('bookingId') bookingId: string) {
    return await this.bookingService
      .getSessionsByBookingId(bookingId)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Patch('cancel-therapy-session/:sessionId')
  @ApiOperation({
    summary: 'Cancel Therapy Session REST API',
    description:
      'Cancel Therapy Session REST API is used to cancel a therapy session.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async cancelTherapySession(@Param('sessionId') sessionId: string) {
    return await this.bookingService
      .cancelTherapySession(sessionId)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('get-therapy-sessions/therapist/:therapistId')
  @ApiOperation({
    summary: 'Get Therapy Sessions REST API',
    description:
      'Get Therapy Sessions REST API is used to get therapy sessions.',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Date in YYYY-MM-DD format (default: today)',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async getTherapySessions(
    @Param('therapistId') therapistId: string,
    @Query('date') date?: Date,
  ) {
    return await this.bookingService
      .getTherapySessionsByTherapistId(therapistId, date || new Date())
      .then((result) => new BaseResponseDto(200, result));
  }
}
