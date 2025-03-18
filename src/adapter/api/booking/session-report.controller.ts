import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiQuery, ApiTags} from '@nestjs/swagger';
import { IBookingService } from '../../../application/booking/booking-service.interface';
import { SessionFlaggingReportRequestDto } from '../../dto/booking/session-flagging-report-request.dto';
import { JwtAuthGuard } from '../../../infrastructure/security/guard/jwt-auth.guard';
import { CurrentUser } from '../../../infrastructure/security/decorator/current-user.decorator';
import { TokenPayload } from '../../../application/user/service/token.service';
import { BaseResponseDto } from '../../dto/base-response.dto';

@Controller('session/flag-report')
@ApiTags('Therapy Session - Flag Report')
export class SessionReportController {
  constructor(
    @Inject('IBookingService') private readonly bookingService: IBookingService,
  ) {}

  @Post(':sessionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Flag Report REST API',
    description: 'Flag Report REST API is used to flag a session report.',
  })
  async flagReport(
    @CurrentUser() info: TokenPayload,
    @Param('sessionId') sessionId: string,
    @Body() request: SessionFlaggingReportRequestDto,
  ) {
    return await this.bookingService
      .flagSessionReport({
        sessionId,
        userId: info.userId,
        flagReport: request,
      })
      .then((result) => new BaseResponseDto(201, result));
  }

  @Get('get-all-session-reports')
  @ApiOperation({
    summary: 'Get All Session Reports REST API',
    description:
      'Get All Session Reports REST API is used to get all session reports.',
  })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
  @ApiQuery({ name: 'status', required: false, example: 'PENDING' })
  async getAllSessionReports(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status?: string,
  ) {
    return await this.bookingService
      .getAllSessionReports({ page, limit, status })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('get-my-created-session-reports')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get My Created Session Reports REST API',
    description:
      'Get My Created Session Reports REST API is used to get all session reports created by the logged in user.',
  })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
  @ApiQuery({ name: 'status', required: false, example: 'PENDING' })
  async getMyCreatedSessionReports(
    @CurrentUser() info: TokenPayload,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status?: string,
  ) {
    return await this.bookingService
      .getSessionReportsByUserId({ page, limit, status, userId: info.userId })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('get-session-report-of-member/:userId')
  @ApiOperation({
    summary: 'Get Session Report Of Member REST API',
    description:
      'Get Session Report Of Member REST API is used to get all session reports of a member.',
  })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
  @ApiQuery({ name: 'status', required: false, example: 'PENDING' })
  async getSessionReportOfMember(
    @Param('userId') userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status?: string,
  ) {
    return await this.bookingService
      .getSessionReportsByUserId({ page, limit, status, userId })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Put(':reportId/review')
  @ApiOperation({
    summary: 'Review Session Report REST API',
    description:
      'Review Session Report REST API is used to review a session report.',
  })
  @ApiQuery({ name: 'approve', required: true, type: Boolean })
  async reviewFlagReport(
    @Param('reportId') reportId: string,
    @Query('approve') approve: boolean,
  ) {
    return await this.bookingService
      .reviewFlagReport({ reportId, approve })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('get-therapist-session-reports/:therapistId')
  @ApiOperation({
    summary: 'Get Therapist Session Reports REST API',
    description:
      'Get Therapist Session Reports REST API is used to get all session reports of a therapist.',
  })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
  @ApiQuery({ name: 'status', required: false, example: 'PENDING' })
  async getTherapistSessionReports(
    @Param('therapistId') therapistId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status?: string,
  ) {
    return await this.bookingService
      .getTherapistSessionReports({ page, limit, status, therapistId })
      .then((result) => new BaseResponseDto(200, result));
  }
}
