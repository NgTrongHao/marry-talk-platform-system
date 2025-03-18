import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPayoutService } from '../../../application/payout/payout-service.interface';
import { JwtAuthGuard } from '../../../infrastructure/security/guard/jwt-auth.guard';
import { BaseResponseDto } from '../../dto/base-response.dto';
import { CurrentUser } from '../../../infrastructure/security/decorator/current-user.decorator';
import { TokenPayload } from '../../../application/user/service/token.service';
import { CreateRefundRequestDto } from '../../dto/payout/create-refund-request.dto';
import { CompletePayoutDto } from '../../dto/payout/complete-payout.dto';
import { TransactionType } from '../../../core/domain/entity/enum/transaction-type.enum';

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
}
