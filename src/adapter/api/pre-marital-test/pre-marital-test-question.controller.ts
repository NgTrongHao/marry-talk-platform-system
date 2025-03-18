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
import { QuestionRequestDto } from '../../dto/pre-marital-test/question-request.dto';
import { BaseResponseDto } from '../../dto/base-response.dto';
import { TestQuestionInfoResponseDto } from '../../../application/premarital-test/service/dto/test-question-info-response.dto';

@Controller('premarital-tests')
@ApiTags('Pre-Marital Test - Questions')
export class PreMaritalTestQuestionController {
  constructor(
    @Inject('IPremaritalTestService')
    private therapistManagementService: IPremaritalTestService,
  ) {}

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

  @Patch('update-question-name/:questionId')
  @ApiOperation({
    summary: 'Update Question REST API',
    description:
      'Update Question REST API is used to update a question of a pre-marital test.',
  })
  async updateQuestion(
    @Param('questionId') questionId: string,
    @Body() request: string,
  ) {
    return await this.therapistManagementService
      .updateQuestion({ questionId, name: request })
      .then((result) => new BaseResponseDto(200, result));
  }
}
