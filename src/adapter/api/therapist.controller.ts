import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { BaseResponseDto } from '../dto/base-response.dto';
import { ITherapistManagementService } from '../../application/therapist-management/therapist-management-service.interface';
import { TherapistInfoResponseDto } from '../../application/user/service/dto/therapist-info-response.dto';
import { CurrentUser } from '../../infrastructure/security/decorator/current-user.decorator';
import { TokenPayload } from '../../application/user/service/token.service';
import { TherapistScheduleRequest } from '../dto/therapist/therapist-schedule-request.dto';
import { JwtAuthGuard } from '../../infrastructure/security/guard/jwt-auth.guard';
import { TherapistPayoutAccountRequestDto } from '../dto/therapist/therapist-payout-account-request.dto';

@Controller('therapists')
@ApiTags('Therapist')
export class TherapistController {
  constructor(
    @Inject('ITherapistManagementService')
    private therapistManagementService: ITherapistManagementService,
  ) {}

  @Get('get-all-approved-therapists')
  @ApiOperation({
    summary: 'Get All Approved Therapists REST API',
    description:
      'Get All Approved Therapists REST API is used to get all approved therapists.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'therapyId', required: false, type: String })
  @ApiResponseProperty({
    type: BaseResponseDto<{
      therapists: TherapistInfoResponseDto[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>,
  })
  async getAllApprovedTherapists(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('therapyId') therapyId?: string,
  ) {
    return await this.therapistManagementService
      .getAllApprovedTherapists({ page, limit, therapyId })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('get-unapproved-therapists')
  @ApiOperation({
    summary: 'Get Unapproved Therapists REST API',
    description:
      'Get Unapproved Therapists REST API is used to get all unapproved therapists.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'therapyId', required: false, type: String })
  @ApiResponseProperty({
    type: BaseResponseDto<{
      therapists: TherapistInfoResponseDto[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>,
  })
  async getUnapprovedTherapists(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('therapyId') therapyId?: string,
  ) {
    return await this.therapistManagementService
      .getUnapprovedTherapists({ page, limit, therapyId })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Patch('approve-therapist-type/:therapistId/therapy/:therapyId')
  @ApiOperation({
    summary: 'Approve/Reject Therapist Type REST API',
    description:
      'Approve/Reject Therapist Type REST API is used to approve or reject therapist type.',
  })
  async approveTherapyCategory(
    @Param('therapistId') therapistId: string,
    @Param('therapyId') therapyId: string,
    @Query('approve') approve: boolean,
  ) {
    return await this.therapistManagementService
      .approveTherapyCategory({ therapistId, categoryId: therapyId, approve })
      .then(
        () => new BaseResponseDto(200, 'Therapist type changed successfully'),
      );
  }

  @Patch('approve-therapist/:therapistId')
  @ApiOperation({
    summary: 'Approve/Reject Therapist REST API',
    description:
      'Approve/Reject Therapist REST API is used to approve or reject user to be therapist-management.',
  })
  async approveTherapist(
    @Param('therapistId') therapistId: string,
    @Query('approve') approve: boolean,
  ) {
    return await this.therapistManagementService
      .approveTherapist({ therapistId, approve })
      .then(() => new BaseResponseDto(200, 'Therapist approved successfully'));
  }

  @Get('find-qualified-therapists-with-therapy/:therapyId')
  @ApiOperation({
    summary: 'Find Therapists with Therapy REST API',
    description:
      'Find Therapists with Therapy REST API is used to find qualified therapists with therapy.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponseProperty({
    type: BaseResponseDto<{
      therapists: TherapistInfoResponseDto[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }>,
  })
  async findTherapistWithTherapies(
    @Param('therapyId') therapyId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.therapistManagementService
      .findTherapistWithTherapies({ therapyCategoryId: therapyId, page, limit })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Put('me/put-therapist-working-hours')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Put Therapist Working Hours REST API',
    description:
      'Put Therapist Working Hours REST API is used to put working hours for therapist.',
  })
  async putTherapistWorkingHours(
    @CurrentUser() info: TokenPayload,
    @Body() request: TherapistScheduleRequest,
  ) {
    console.info('Schedule Request:', request);
    return await this.therapistManagementService
      .putTherapistWorkingHours(info.userId, request.workingHours)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('working-hours/:therapistId')
  @ApiOperation({
    summary: 'Get Therapist Working Hours REST API',
    description:
      'Get Therapist Working Hours REST API is used to get working hours for therapist.',
  })
  async getTherapistWorkingHours(@Param('therapistId') therapistId: string) {
    return await this.therapistManagementService
      .getTherapistWorkingHours(therapistId)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Post('add-payout-account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add Payout Account REST API',
    description:
      'Add Payout Account REST API is used to add payout account for therapist.',
  })
  async addPayoutAccount(
    @CurrentUser() info: TokenPayload,
    @Body() request: TherapistPayoutAccountRequestDto,
  ) {
    return await this.therapistManagementService
      .addPayoutAccount(info.userId, request)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('get-payout-accounts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Payout Accounts REST API',
    description:
      'Get Payout Accounts REST API is used to get payout accounts for therapist.',
  })
  async getPayoutAccounts(@CurrentUser() info: TokenPayload) {
    return await this.therapistManagementService
      .getTherapistPayoutAccounts(info.userId)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('get-therapist-balance')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Therapist Balance REST API',
    description:
      'Get Therapist Balance REST API is used to get balance of therapist.',
  })
  async getTherapistBalance(@CurrentUser() info: TokenPayload) {
    return await this.therapistManagementService
      .getTherapistBalance(info.userId)
      .then((result) => new BaseResponseDto(200, result));
  }
}
