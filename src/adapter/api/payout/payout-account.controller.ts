import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IPayoutService } from '../../../application/payout/payout-service.interface';
import { JwtAuthGuard } from '../../../infrastructure/security/guard/jwt-auth.guard';
import { CurrentUser } from '../../../infrastructure/security/decorator/current-user.decorator';
import { TokenPayload } from '../../../application/user/service/token.service';
import { TherapistPayoutAccountRequestDto } from '../../dto/therapist/therapist-payout-account-request.dto';
import { BaseResponseDto } from '../../dto/base-response.dto';

@Controller('payout')
@ApiTags('Payout - Account')
export class PayoutAccountController {
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

  @Get('get-payout-account/:userId')
  @ApiOperation({
    summary: 'Get Payout Account REST API',
    description:
      'Get Payout Account REST API is used to get payout account by user id.',
  })
  async getPayoutAccount(@Param('userId') userId: string) {
    return await this.payoutService
      .getTherapistPayoutAccounts(userId)
      .then((result) => new BaseResponseDto(200, result));
  }
}
