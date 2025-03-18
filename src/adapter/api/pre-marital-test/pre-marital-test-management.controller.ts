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
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { IPremaritalTestService } from '../../../application/premarital-test/pre-marital-test-service.interface';
import { BaseResponseDto } from '../../dto/base-response.dto';
import { CreatePreMaritalTestRequestDto } from '../../dto/pre-marital-test/create-pre-marital-test-request.dto';
import { PreMaritalTestInfoResponseDto } from '../../../application/premarital-test/service/dto/pre-marital-test-info-response.dto';
import { UpdatePreMaritalTestRequestDto } from '../../dto/pre-marital-test/update-pre-marital-test-request.dto';

@Controller('premarital-tests')
@ApiTags('Pre-Marital Test - Management')
export class PreMaritalTestManagementController {
  constructor(
    @Inject('IPremaritalTestService')
    private therapistManagementService: IPremaritalTestService,
  ) {}

  @Post('create-test')
  @ApiOperation({
    summary: 'Create Pre-Marital Test REST API',
    description:
      'Create Pre-Marital Test REST API is used to create a new pre-marital test.',
  })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponseProperty({
    type: BaseResponseDto<CreatePreMaritalTestRequestDto>,
  })
  async createTest(@Body() request: CreatePreMaritalTestRequestDto) {
    return await this.therapistManagementService
      .createTest(request)
      .then((result) => new BaseResponseDto(201, result));
  }

  @Patch('update-test/:id')
  @ApiOperation({
    summary: 'Update Pre-Marital Test REST API',
    description:
      'Update Pre-Marital Test REST API is used to update a pre-marital test.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponseProperty({
    type: BaseResponseDto<CreatePreMaritalTestRequestDto>,
  })
  async updateTest(
    @Body() request: UpdatePreMaritalTestRequestDto,
    @Param('id') id: string,
  ) {
    return await this.therapistManagementService
      .updateTest(id, request)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('get-all-tests')
  @ApiOperation({
    summary: 'Get All Pre-Marital Tests REST API',
    description:
      'Get All Pre-Marital Tests REST API is used to get all pre-marital tests.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'therapyId',
    required: false,
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponseProperty({
    type: BaseResponseDto<{
      tests: CreatePreMaritalTestRequestDto[];
      page: number;
      limit: number;
    }>,
  })
  async getAllTests(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('therapyId') therapyId?: string,
  ) {
    return await this.therapistManagementService
      .getAllTests({ therapyId, page, limit })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('get-test-info/:id')
  @ApiOperation({
    summary: 'Get Pre-Marital Test Info REST API',
    description:
      'Get Pre-Marital Test Info REST API is used to get a pre-marital test by its ID.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponseProperty({
    type: BaseResponseDto<PreMaritalTestInfoResponseDto>,
  })
  async getTestById(@Param('id') id: string) {
    return await this.therapistManagementService
      .getTestById(id)
      .then((result) => new BaseResponseDto(200, result));
  }
}
