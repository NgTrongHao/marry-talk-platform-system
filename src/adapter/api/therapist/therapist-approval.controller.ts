import { Controller, Get, Inject, Param, Patch, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { ITherapistManagementService } from '../../../application/therapist-management/therapist-management-service.interface';
import { BaseResponseDto } from '../../dto/base-response.dto';
import { TherapistInfoResponseDto } from '../../../application/user/service/dto/therapist-info-response.dto';

@Controller('therapists')
@ApiTags('Therapist - Approval')
export class TherapistApprovalController {
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
}
