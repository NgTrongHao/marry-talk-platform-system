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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiResponseProperty,
  ApiTags,
} from '@nestjs/swagger';
import { IPremaritalTestService } from '../../application/premarital-test/pre-marital-test-service.interface';
import { CreatePreMaritalTestRequestDto } from '../dto/pre-marital-test/create-pre-marital-test-request.dto';
import { BaseResponseDto } from '../dto/base-response.dto';
import { QuestionRequestDto } from '../dto/pre-marital-test/question-request.dto';
import { AnswerRequestDto } from '../dto/pre-marital-test/answer-request.dto';
import { PreMaritalTestInfoResponseDto } from '../../application/premarital-test/service/dto/pre-marital-test-info-response.dto';
import { TestQuestionInfoResponseDto } from '../../application/premarital-test/service/dto/test-question-info-response.dto';
import { TestSubmissionRequestDto } from '../dto/pre-marital-test/test-submission-request.dto';
import { CurrentUser } from '../../infrastructure/security/decorator/current-user.decorator';
import { JwtAuthGuard } from '../../infrastructure/security/guard/jwt-auth.guard';
import { TokenPayload } from '../../application/user/service/token.service';
import { TestResultInfoResponseDto } from '../../application/premarital-test/service/dto/test-result-info-response.dto';

@Controller('premarital-tests')
@ApiTags('Pre-Marital Test')
export class PreMaritalTestController {
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

  @Post('add-question/:testId')
  @ApiOperation({
    summary: 'Add Question REST API',
    description:
      'Add Question REST API is used to add a new question to a pre-marital test.',
  })
  async addQuestion(
    @Param('testId') testId: string,
    @Body() request: QuestionRequestDto,
  ) {
    return await this.therapistManagementService
      .addQuestion({ premaritalTestId: testId, ...request })
      .then((result) => new BaseResponseDto(201, result));
  }

  @Get('get-questions-of-test/:testId')
  @ApiOperation({
    summary: 'Get Questions of Test REST API',
    description:
      'Get Questions of Test REST API is used to get all questions of a pre-marital test.',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponseProperty({
    type: BaseResponseDto<TestQuestionInfoResponseDto[]>,
  })
  async getQuestionsByTestId(
    @Param('testId') testId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return await this.therapistManagementService
      .getQuestionsByTestId({ testId, page, limit })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Put('add-answer/:questionId')
  @ApiOperation({
    summary: 'Add Answer REST API',
    description:
      'Add Answer REST API is used to add a new answer to a question.',
  })
  async addAnswer(
    @Param('questionId') questionId: string,
    @Body() request: AnswerRequestDto,
  ) {
    return await this.therapistManagementService
      .addAnswer({ questionId, ...request })
      .then((result) => new BaseResponseDto(201, result));
  }

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
