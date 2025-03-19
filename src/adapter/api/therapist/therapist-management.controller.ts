import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Param,
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
import { BaseResponseDto } from '../../dto/base-response.dto';
import { ITherapistManagementService } from '../../../application/therapist-management/therapist-management-service.interface';
import { TherapistInfoResponseDto } from '../../../application/user/service/dto/therapist-info-response.dto';
import { CurrentUser } from '../../../infrastructure/security/decorator/current-user.decorator';
import { TokenPayload } from '../../../application/user/service/token.service';
import { JwtAuthGuard } from '../../../infrastructure/security/guard/jwt-auth.guard';

@Controller('therapists')
@ApiTags('Therapist - Management')
export class TherapistManagementController {
  constructor(
    @Inject('ITherapistManagementService')
    private therapistManagementService: ITherapistManagementService,
  ) {}

  @Get('find-qualified-therapists-with-therapy/:therapyId')
  @ApiOperation({
    summary: 'Find Therapists with Therapy REST API',
    description:
      'Find Therapists with Therapy REST API is used to find qualified therapists with therapy.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'sessionDate', required: false, type: Date })
  @ApiQuery({ name: 'startTime', required: false, type: String })
  @ApiQuery({ name: 'endTime', required: false, type: String })
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
    @Query('sessionDate') sessionDate?: string,
    @Query('startTime') startTime?: string,
    @Query('endTime') endTime?: string,
  ) {
    // check startTime and endTime with type '12:00'
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (startTime && !timeRegex.test(startTime)) {
      throw new BadRequestException('Invalid startTime format. Expected HH:mm');
    }

    if (endTime && !timeRegex.test(endTime)) {
      throw new BadRequestException('Invalid endTime format. Expected HH:mm');
    }

    if (startTime && endTime && startTime > endTime) {
      throw new BadRequestException('startTime must be before endTime');
    }

    const parsedDate = sessionDate ? new Date(sessionDate) : undefined;
    if (parsedDate && isNaN(parsedDate.getTime())) {
      throw new BadRequestException(
        'Invalid sessionDate format. Expected YYYY-MM-DD',
      );
    }

    return await this.therapistManagementService
      .findTherapistWithTherapies({
        therapyCategoryId: therapyId,
        page,
        limit,
        sessionDate: parsedDate,
        startTime,
        endTime,
      })
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
