import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IBookingService } from '../../application/booking/booking-service.interface';
import { AddTherapySessionRequestDto } from '../dto/booking/add-therapy-session-request.dto';
import { BaseResponseDto } from '../dto/base-response.dto';

@Controller('session')
@ApiTags('Therapy Session')
export class SessionController {
  constructor(
    @Inject('IBookingService') private readonly bookingService: IBookingService,
  ) {}

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

  @Get('get-therapy-sessions-of-therapist')
  @ApiOperation({
    summary: 'Get Therapy Sessions REST API',
    description:
      'Get Therapy Sessions REST API is used to get therapy sessions of therapist.',
  })
  @ApiQuery({ name: 'therapist', required: true, description: 'Therapist ID' })
  @ApiQuery({
    name: 'date',
    required: false,
    description: 'Date in YYYY-MM-DD format (default: today)',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async getTherapySessions(
    @Query('therapist') therapistId: string,
    @Query('date') date?: Date,
  ) {
    return await this.bookingService
      .getTherapySessionsByTherapistId(therapistId, date || new Date())
      .then((result) => new BaseResponseDto(200, result));
  }

  @Patch('complete-therapy-session/:sessionId')
  @ApiOperation({
    summary: 'Complete Therapy Session REST API',
    description:
      'Complete Therapy Session REST API is used to complete a therapy session.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async completeTherapySession(@Param('sessionId') sessionId: string) {
    return await this.bookingService
      .completeTherapySession(sessionId)
      .then((result) => new BaseResponseDto(200, result));
  }
}
