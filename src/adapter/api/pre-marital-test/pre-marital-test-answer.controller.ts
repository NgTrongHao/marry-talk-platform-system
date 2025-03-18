import {
  Body,
  Controller,
  Inject,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPremaritalTestService } from '../../../application/premarital-test/pre-marital-test-service.interface';
import { AnswerRequestDto } from '../../dto/pre-marital-test/answer-request.dto';
import { BaseResponseDto } from '../../dto/base-response.dto';

@Controller('premarital-tests')
@ApiTags('Pre-Marital Test - Answer')
export class PreMaritalTestAnswerController {
  constructor(
    @Inject('IPremaritalTestService')
    private therapistManagementService: IPremaritalTestService,
  ) {}

  @Put('add-answer/:questionId')
  @ApiOperation({
    summary: 'Add Answer REST API',
    description:
      'Add Answer REST API is used to add a new answer to a question.' +
      '⚠️ This endpoint is deprecated. Use POST /add-answer instead.',
    deprecated: true,
  })
  async addAnswerPut(
    @Param('questionId') questionId: string,
    @Body() request: AnswerRequestDto,
  ) {
    return await this.therapistManagementService
      .addAnswer({ questionId, ...request })
      .then((result) => new BaseResponseDto(201, result));
  }

  @Post('add-answer/:questionId')
  @ApiOperation({
    summary: 'Add Answer REST API (New)',
    description: 'Use this endpoint to add a new answer to a question.',
  })
  async addAnswer(
    @Param('questionId') questionId: string,
    @Body() request: AnswerRequestDto,
  ) {
    return await this.therapistManagementService
      .addAnswer({ questionId, ...request })
      .then((result) => new BaseResponseDto(201, result));
  }

  @Patch('update-answer/:answerId')
  @ApiOperation({
    summary: 'Update Answer REST API',
    description: 'Update Answer REST API is used to update an answer.',
  })
  async updateAnswer(
    @Param('answerId') answerId: string,
    @Body() request: AnswerRequestDto,
  ) {
    return await this.therapistManagementService
      .updateAnswer({ answerId, ...request })
      .then((result) => new BaseResponseDto(200, result));
  }
}
