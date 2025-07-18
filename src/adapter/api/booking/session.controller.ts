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
import { IBookingService } from '../../../application/booking/booking-service.interface';
import { AddTherapySessionRequestDto } from '../../dto/booking/add-therapy-session-request.dto';
import { BaseResponseDto } from '../../dto/base-response.dto';
import { JwtAuthGuard } from '../../../infrastructure/security/guard/jwt-auth.guard';
import { CurrentUser } from '../../../infrastructure/security/decorator/current-user.decorator';
import { TokenPayload } from '../../../application/user/service/token.service';
import { validateFilters } from '../../../application/shared/utils/filter-validator.util';
import { AddMeetingUrlDto } from '../../dto/booking/add-meeting-url.dto';

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

  @Patch('add-meeting-link-session/:sessionId')
  @ApiOperation({
    summary: 'Add Meeting Link Session REST API',
    description:
      'Add Meeting Link Session REST API is used to add a meeting link to a session.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  async addMeetingLinkSession(
    @Param('sessionId') sessionId: string,
    @Body() request: AddMeetingUrlDto,
  ) {
    return await this.bookingService
      .addMeetingUrlToSession(sessionId, request.meetingLink)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('/my-therapy-sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get My Therapy Sessions REST API (for member)',
    description:
      'Get My Therapy Sessions REST API is used to get therapy sessions of therapist.',
  })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
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
  @ApiQuery({ name: 'status', required: false, example: 'PENDING' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getMyTherapySessions(
    @CurrentUser() info: TokenPayload,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('status') status?: string,
  ) {
    const { parsedFromDate, parsedToDate } = validateFilters(
      status,
      fromDate,
      toDate,
    );

    return await this.bookingService
      .getTherapySessionsByUserId(
        info.userId,
        page,
        limit,
        parsedFromDate,
        parsedToDate,
        status,
      )
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('therapist/my-therapy-sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get My Therapy Sessions REST API (for therapist)',
    description:
      'Get My Therapy Sessions REST API is used to get therapy sessions of therapist.',
  })
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
  @ApiQuery({ name: 'status', required: false, example: 'PENDING' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getMyTherapySessionsForTherapist(
    @CurrentUser() info: TokenPayload,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('status') status?: string,
  ) {
    const { parsedFromDate, parsedToDate } = validateFilters(
      status,
      fromDate,
      toDate,
    );

    return await this.bookingService
      .getTherapySessionsByTherapistId(
        info.userId,
        status,
        parsedFromDate,
        parsedToDate,
      )
      .then((result) => new BaseResponseDto(200, result));
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
    name: 'fromDate',
    required: false,
    description: 'Date in YYYY-MM-DD format',
  })
  @ApiQuery({
    name: 'toDate',
    required: false,
    description: 'Date in YYYY-MM-DD format',
  })
  @ApiQuery({ name: 'status', required: false, example: 'PENDING' })
  @ApiResponse({ status: 200, description: 'Success' })
  async getTherapySessions(
    @Query('therapist') therapistId: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('status') status?: string,
  ) {
    const { parsedFromDate, parsedToDate } = validateFilters(
      status,
      fromDate,
      toDate,
    );
    return await this.bookingService
      .getTherapySessionsByTherapistId(
        therapistId,
        status,
        parsedFromDate,
        parsedToDate,
      )
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
