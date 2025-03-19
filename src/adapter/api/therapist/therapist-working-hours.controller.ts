import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ITherapistManagementService } from '../../../application/therapist-management/therapist-management-service.interface';
import { JwtAuthGuard } from '../../../infrastructure/security/guard/jwt-auth.guard';
import { CurrentUser } from '../../../infrastructure/security/decorator/current-user.decorator';
import { TokenPayload } from '../../../application/user/service/token.service';
import { TherapistScheduleRequest } from '../../dto/therapist/therapist-schedule-request.dto';
import { BaseResponseDto } from '../../dto/base-response.dto';

@Controller('therapists')
@ApiTags('Therapist - Working Hours')
export class TherapistWorkingHoursController {
  constructor(
    @Inject('ITherapistManagementService')
    private therapistManagementService: ITherapistManagementService,
  ) {}

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
}
