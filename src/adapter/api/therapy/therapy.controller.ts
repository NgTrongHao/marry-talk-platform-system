import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ITherapyManagementService } from '../../../application/therapy-management/therapy-management-service.interface';
import { CreateTherapyCategoryRequestDto } from '../../dto/therapy/create-therapy-category-request.dto';
import { BaseResponseDto } from '../../dto/base-response.dto';

@Controller('therapies')
@ApiTags('Therapy')
export class TherapyController {
  constructor(
    @Inject('ITherapyManagementService')
    private therapyManagementService: ITherapyManagementService,
  ) {}

  @Post('therapy-category/create-therapy-category')
  @ApiOperation({
    summary: 'Create Therapy Category REST API',
    description:
      'Create Therapy Category REST API is used to create a new therapy category.',
  })
  async createTherapyCategory(
    @Body() request: CreateTherapyCategoryRequestDto,
  ) {
    return await this.therapyManagementService
      .createTherapyCategory(request)
      .then(
        () => new BaseResponseDto(201, 'Therapy Category created successfully'),
      );
  }

  @Get('therapy-category/get-therapy-by-id/:therapyId')
  @ApiOperation({
    summary: 'Get Therapy Category by ID REST API',
    description:
      'Get Therapy Category by ID REST API is used to get therapy category by ID.',
  })
  async getTherapyCategoryById(@Param('therapyId') therapyId: string) {
    return await this.therapyManagementService
      .getTherapyCategoryById({ id: therapyId })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('therapy-categories/get-all')
  @ApiOperation({
    summary: 'Get All Therapy Category REST API',
    description:
      'Get All Therapy Category REST API is used to get all therapy categories.',
  })
  async getAllTherapyCategories() {
    return await this.therapyManagementService
      .getAllTherapyCategories()
      .then((result) => new BaseResponseDto(200, result));
  }

  @Patch('therapy-category/update-therapy-category/:therapyId')
  @ApiOperation({
    summary: 'Update Therapy Category REST API',
    description:
      'Update Therapy Category REST API is used to update therapy category by ID.',
  })
  async updateTherapyCategory(
    @Param('therapyId') therapyId: string,
    @Body() request: CreateTherapyCategoryRequestDto,
  ) {
    return await this.therapyManagementService
      .updateTherapyCategory({ id: therapyId, ...request })
      .then((result) => new BaseResponseDto(200, result));
  }
}
