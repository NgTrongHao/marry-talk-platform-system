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
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { IServicePackageManagementService } from '../../../application/service-package-management/service-package-management-service.interface';
import { CreateServicePackageRequestDto } from '../../dto/service-package/create-service-package-request.dto';
import { BaseResponseDto } from '../../dto/base-response.dto';
import { ServicePackageInfoResponseDto } from '../../../application/service-package-management/service/dto/service-package-info-response.dto';
import { UpdateServicePackageRequestDto } from '../../dto/service-package/update-service-package-request.dto';
import { JwtAuthGuard } from '../../../infrastructure/security/guard/jwt-auth.guard';
import { RoleAuthoriseGuard } from '../../../infrastructure/security/guard/role-authorise.guard';
import { AuthorRole } from '../../../infrastructure/security/decorator/author-role.decorator';
import { Role } from '../../../core/domain/entity/enum/role.enum';
import { CurrentUser } from '../../../infrastructure/security/decorator/current-user.decorator';
import { TokenPayload } from '../../../application/user/service/token.service';
import { SetTherapistServicesRequestDto } from '../../dto/service-package/set-therapist-services-request.dto';
import { UpdateTherapistServiceRequestDto } from '../../dto/service-package/update-therapist-service-request.dto';
import { TherapistServiceInfoResponseDto } from '../../../application/service-package-management/service/dto/therapist-service-info-response.dto';

@Controller('service-package')
@ApiTags('Service Package')
export class ServicePackageController {
  constructor(
    @Inject('IServicePackageManagementService')
    private readonly servicePackageManagementService: IServicePackageManagementService,
  ) {}

  @Get('get-all-service-packages')
  @ApiOperation({
    summary: 'Get All Service Packages REST API',
    description:
      'Get All Service Packages REST API is used to get all service packages.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponseProperty({
    type: BaseResponseDto<ServicePackageInfoResponseDto[]>,
  })
  async getAllServicePackages() {
    return await this.servicePackageManagementService
      .getAllServicePackages()
      .then((result) => new BaseResponseDto(200, result));
  }

  @Post('management/create')
  @ApiOperation({
    summary: 'Create Service Package REST API',
    description:
      'Create Service Package REST API is used to create a new service package.',
  })
  @ApiResponse({ status: 201, description: 'Created' })
  async createServicePackage(@Body() request: CreateServicePackageRequestDto) {
    return await this.servicePackageManagementService
      .createServicePackage(request)
      .then((result) => new BaseResponseDto(201, result));
  }

  @Patch('management/update-service-package/:servicePackageId')
  @ApiOperation({
    summary: 'Update Service Package REST API',
    description:
      'Update Service Package REST API is used to update a service package.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponseProperty({
    type: BaseResponseDto<ServicePackageInfoResponseDto>,
  })
  async updateServicePackage(
    @Body() request: UpdateServicePackageRequestDto,
    @Param('servicePackageId') servicePackageId: string,
  ) {
    return await this.servicePackageManagementService
      .updateServicePackage(servicePackageId, request)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Post('therapist/service-packages')
  @UseGuards(JwtAuthGuard, RoleAuthoriseGuard)
  @AuthorRole(Role.THERAPIST)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Set Service Package REST API',
    description:
      'Set Service Package REST API is used by therapist to set therapist service based on service package, allows defining price and description.',
  })
  @ApiResponse({ status: 201, description: 'Set' })
  @ApiResponseProperty({
    type: BaseResponseDto<TherapistServiceInfoResponseDto[]>,
  })
  async setTherapistServicePackages(
    @CurrentUser() info: TokenPayload,
    @Body() request: SetTherapistServicesRequestDto,
  ) {
    return await this.servicePackageManagementService
      .setTherapistServices(info.userId, request)
      .then((result) => new BaseResponseDto(201, result));
  }

  @Patch('therapist/service-packages/:therapistServiceId')
  @UseGuards(JwtAuthGuard, RoleAuthoriseGuard)
  @AuthorRole(Role.THERAPIST)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update Therapist Service REST API',
    description:
      'Update Therapist Service REST API is used by therapist to update therapist service.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponseProperty({
    type: BaseResponseDto<TherapistServiceInfoResponseDto>,
  })
  async updateTherapistService(
    @Body() request: UpdateTherapistServiceRequestDto,
    @Param('therapistServiceId') therapistServiceId: string,
  ) {
    return await this.servicePackageManagementService
      .updateTherapistService(therapistServiceId, request)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('get-therapist-services/:therapistId')
  @ApiOperation({
    summary: 'Get Therapist Services REST API',
    description:
      'Get Therapist Services REST API is used to get all therapist services.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponseProperty({
    type: BaseResponseDto<TherapistServiceInfoResponseDto[]>,
  })
  @ApiQuery({ name: 'therapyId', required: false, type: String })
  @ApiQuery({ name: 'sessions', required: false, type: Number })
  @ApiQuery({ name: 'servicePackageId', required: false, type: String })
  async getTherapistServices(
    @Param('therapistId') therapistId: string,
    @Query('therapyId') therapyId?: string,
    @Query('sessions') sessions?: number,
    @Query('servicePackageId') servicePackageId?: string,
  ) {
    return await this.servicePackageManagementService
      .getTherapistServices(therapistId, {
        therapyId,
        sessions,
        servicePackageId,
      })
      .then((result) => new BaseResponseDto(200, result));
  }
}
