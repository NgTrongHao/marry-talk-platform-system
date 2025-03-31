import {
  BadRequestException,
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
  ApiTags,
} from '@nestjs/swagger';
import { IPayoutService } from '../../../application/payout/payout-service.interface';
import { JwtAuthGuard } from '../../../infrastructure/security/guard/jwt-auth.guard';
import { BaseResponseDto } from '../../dto/base-response.dto';
import { CurrentUser } from '../../../infrastructure/security/decorator/current-user.decorator';
import { TokenPayload } from '../../../application/user/service/token.service';
import { CreateRefundRequestDto } from '../../dto/payout/create-refund-request.dto';
import { CompletePayoutDto } from '../../dto/payout/complete-payout.dto';
import { TransactionType } from '../../../core/domain/entity/enum/transaction-type.enum';
import { RequestStatus } from '../../../core/domain/entity/enum/request-status.enum';

@Controller('payout')
@ApiTags('Payout - Refund')
export class PayoutRefundController {
  constructor(
    @Inject('IPayoutService')
    private payoutService: IPayoutService,
  ) {}

  @Post('refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Payout Refund REST API',
    description: 'Payout Refund REST API is used to refund a payout.',
  })
  async refund(
    @CurrentUser() info: TokenPayload,
    @Body() request: CreateRefundRequestDto,
  ) {
    return await this.payoutService
      .createRefundRequest({
        userId: info.userId,
        ...request,
      })
      .then((result) => new BaseResponseDto(201, result));
  }

  @Put('refund/:refundId/complete')
  @ApiOperation({
    summary: 'Complete Refund REST API',
    description: 'Complete Refund REST API is used to complete a refund.',
  })
  async completeRefund(
    @Param('refundId') refundId: string,
    @Body() request: CompletePayoutDto,
  ) {
    return await this.payoutService
      .completeRefundRequest(refundId, {
        transactionType: TransactionType.REFUND,
        ...request,
      })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('refund/get-refund-request/:reportId')
  @ApiOperation({
    summary: 'Get Refund Request By Report ID REST API',
    description:
      'Get Refund Request By Report ID REST API is used to get a refund request by report ID.',
  })
  async getRefundRequestByReportId(@Param('reportId') reportId: string) {
    return await this.payoutService
      .getRefundRequestByReportId(reportId)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('refund/get-refund-requests/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get All Refund Requests REST API',
    description:
      'Get All Refund Requests REST API is used to get all refund requests.',
  })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
  @ApiQuery({ name: 'status', required: false, example: 'PENDING' })
  async getAllRefundRequests(
    @CurrentUser() info: TokenPayload,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status?: string,
  ) {
    if (
      status &&
      !Object.values(RequestStatus).includes(status as RequestStatus)
    ) {
      throw new BadRequestException({
        statusCode: 400,
        message: `Invalid status value: ${status}. Allowed values: ${Object.values(RequestStatus).join(', ')}`,
        error: 'Bad Request',
      });
    }
    return await this.payoutService
      .getAllRefundRequests({
        page,
        limit,
        status,
        userId: info.userId,
      })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('refund/get-all')
  @ApiOperation({
    summary: 'Get All Refund Requests REST API',
    description:
      'Get All Refund Requests REST API is used to get all refund requests.',
  })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
  @ApiQuery({ name: 'status', required: false, example: 'PENDING' })
  async getAllRefundRequestsAdmin(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status?: string,
  ) {
    if (
      status &&
      !Object.values(RequestStatus).includes(status as RequestStatus)
    ) {
      throw new BadRequestException({
        statusCode: 400,
        message: `Invalid status value: ${status}. Allowed values: ${Object.values(RequestStatus).join(', ')}`,
        error: 'Bad Request',
      });
    }
    return await this.payoutService
      .getAllRefundRequests({
        page,
        limit,
        status,
        userId: undefined,
      })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('refund/get-refund-transaction/:refundId')
  @ApiOperation({
    summary: 'Get Refund Transaction By Refund ID REST API',
    description:
      'Get Refund Transaction By Refund ID REST API is used to get a refund transaction by refund ID.',
  })
  async getRefundTransactionByRefundId(@Param('refundId') refundId: string) {
    return await this.payoutService
      .getRefundTransactionByRefundId(refundId)
      .then((result) => new BaseResponseDto(200, result));
  }
}
