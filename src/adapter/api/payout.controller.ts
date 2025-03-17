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
import { IPayoutService } from '../../application/payout/payout-service.interface';
import { JwtAuthGuard } from '../../infrastructure/security/guard/jwt-auth.guard';
import { CurrentUser } from '../../infrastructure/security/decorator/current-user.decorator';
import { TokenPayload } from '../../application/user/service/token.service';
import { TherapistPayoutAccountRequestDto } from '../dto/therapist/therapist-payout-account-request.dto';
import { BaseResponseDto } from '../dto/base-response.dto';
import { CreateWithdrawRequestDto } from '../dto/payout/create-withdraw-request.dto';
import { RequestStatus } from '../../core/domain/entity/enum/request-status.enum';
import { CompletePayoutDto } from '../dto/payout/complete-payout.dto';
import { TransactionType } from '../../core/domain/entity/enum/transaction-type.enum';

@Controller('payout')
@ApiTags('Payout')
export class PayoutController {
  constructor(
    @Inject('IPayoutService')
    private payoutService: IPayoutService,
  ) {}

  @Post('add-payout-account')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add Payout Account REST API',
    description:
      'Add Payout Account REST API is used to add payout account for therapist.',
  })
  async addPayoutAccount(
    @CurrentUser() info: TokenPayload,
    @Body() request: TherapistPayoutAccountRequestDto,
  ) {
    return await this.payoutService
      .addPayoutAccount(info.userId, request)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('get-payout-accounts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Payout Accounts REST API',
    description:
      'Get Payout Accounts REST API is used to get payout accounts for therapist.',
  })
  async getPayoutAccounts(@CurrentUser() info: TokenPayload) {
    return await this.payoutService
      .getTherapistPayoutAccounts(info.userId)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Request Withdraw REST API',
    description:
      'Request Withdraw REST API is used to request withdraw for therapist.',
  })
  @ApiQuery({ name: 'payout-account', required: true })
  async requestWithdraw(
    @CurrentUser() info: TokenPayload,
    @Body() request: CreateWithdrawRequestDto,
    @Query('payout-account') payoutAccountId: string,
  ) {
    return await this.payoutService
      .requestTherapistWithdraw({
        payoutAccountId: payoutAccountId,
        therapistId: info.userId,
        amount: request.amount,
        currency: request.currency,
      })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('get-withdraw-requests/me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get Withdraw Requests REST API',
    description:
      'Get Withdraw Requests REST API is used to get own withdraw requests.',
  })
  @ApiQuery({ name: 'payout-account', required: false })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
  @ApiQuery({ name: 'status', required: false, example: 'PENDING' })
  async getOwnWithdrawRequests(
    @CurrentUser() info: TokenPayload,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('status') status?: string,
    @Query('payout-account') payoutAccountId?: string,
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
      .getWithdrawRequestsByTherapistId({
        page,
        limit,
        status,
        payoutAccountId,
        therapistId: info.userId,
      })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Put('withdraw/:withdrawRequestId/review')
  @ApiOperation({
    summary: 'Review Withdraw Request REST API',
    description:
      'Review Withdraw Request REST API is used to review withdraw request.',
  })
  @ApiQuery({ name: 'approve', required: true, type: Boolean })
  async reviewWithdrawRequest(
    @Query('approve') approve: boolean,
    @Param('withdrawRequestId') withdrawRequestId: string,
  ) {
    return await this.payoutService
      .reviewWithdrawRequest(withdrawRequestId, approve)
      .then((result) => new BaseResponseDto(200, result));
  }

  @Get('get-all-withdraw-requests')
  @ApiOperation({
    summary: 'Get All Withdraw Requests REST API',
    description:
      'Get All Withdraw Requests REST API is used to get all withdraw requests.',
  })
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
  @ApiQuery({ name: 'status', required: false, example: 'PENDING' })
  async getAllWithdrawRequests(
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
      .getAllWithdrawRequests({
        page,
        limit,
        status,
      })
      .then((result) => new BaseResponseDto(200, result));
  }

  @Put('withdraw/:withdrawRequestId/completed')
  @ApiOperation({
    summary: 'Complete Withdraw Request REST API',
    description:
      'Complete Withdraw Request REST API is used to complete withdraw request.',
  })
  async completeWithdrawRequest(
    @Param('withdrawRequestId') withdrawRequestId: string,
    @Body()
    request: CompletePayoutDto,
  ) {
    return await this.payoutService
      .completeWithdrawRequest({
        transactionType: TransactionType.WITHDRAW,
        payoutId: withdrawRequestId,
        ...request,
      })
      .then((result) => new BaseResponseDto(200, result));
  }
}
