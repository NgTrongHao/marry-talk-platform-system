import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
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
import { IPremaritalTestService } from '../../../application/premarital-test/pre-marital-test-service.interface';
import { BaseResponseDto } from '../../dto/base-response.dto';
import { PreMaritalTestInfoResponseDto } from '../../../application/premarital-test/service/dto/pre-marital-test-info-response.dto';
import { TestSubmissionRequestDto } from '../../dto/pre-marital-test/test-submission-request.dto';
import { CurrentUser } from '../../../infrastructure/security/decorator/current-user.decorator';
import { JwtAuthGuard } from '../../../infrastructure/security/guard/jwt-auth.guard';
import { TokenPayload } from '../../../application/user/service/token.service';
import { TestResultInfoResponseDto } from '../../../application/premarital-test/service/dto/test-result-info-response.dto';

@Controller('premarital-tests')
@ApiTags('Pre-Marital Test - Submission')
export class PreMaritalTestSubmissionController {
  constructor(
    @Inject('IPremaritalTestService')
    private therapistManagementService: IPremaritalTestService,
  ) {}

  @Post('submit-test')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Submit Test REST API',
    description: 'Submit Test REST API is used to submit a user test response.',
  })
  async submitUserTestResponse(
    @CurrentUser() info: TokenPayload,
    @Body() request: TestSubmissionRequestDto,
  ) {
    return await this.therapistManagementService
      .submitUserTestResponse({ ...request, userId: info.userId })
      .then((result) => new BaseResponseDto(201, result));
  }

  @Get('get-my-done-tests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get My Done Tests REST API',
    description:
      'Get My Done Tests REST API is used to get all tests done by the current user.',
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
      tests: PreMaritalTestInfoResponseDto[];
      page: number;
      limit: number;
    }>,
  })
  async getMyDoneTests(
    @CurrentUser() info: TokenPayload,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('therapyId') therapyId?: string,
  ) {
    return await this.therapistManagementService
      .getUserDoneTests({ userId: info.userId, page, limit, therapyId })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('get-test-result/:resultId')
  @ApiOperation({
    summary: 'Get Test Result REST API',
    description:
      'Get Test Result REST API is used to get a test result by its ID.',
  })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponseProperty({
    type: BaseResponseDto<TestResultInfoResponseDto>,
  })
  async getTestResultById(@Param('resultId') resultId: string) {
    return await this.therapistManagementService
      .getTestResultById(resultId)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('get-user-done-tests/:userId')
  @ApiOperation({
    summary: 'Get User Done Tests REST API',
    description:
      'Get User Done Tests REST API is used to get all tests done by a user.',
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
      tests: PreMaritalTestInfoResponseDto[];
      page: number;
      limit: number;
    }>,
  })
  async getUserDoneTests(
    @Param('userId') userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('therapyId') therapyId?: string,
  ) {
    return await this.therapistManagementService
      .getUserDoneTests({ userId, page, limit, therapyId })
      .then((result) => new BaseResponseDto(200, result));
  }
}
