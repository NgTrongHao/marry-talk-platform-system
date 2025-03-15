import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProcessBookingPaymentDto } from '../dto/booking/process-booking-payment-request.dto';
import { JwtAuthGuard } from '../../infrastructure/security/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from '../../infrastructure/security/decorator/current-user.decorator';
import { TokenPayload } from '../../application/user/service/token.service';
import { PaymentSupportService } from '../../application/booking/service/payment-support.service';

@Controller('payment')
export class PaymentController {
  constructor(
    @Inject('PaymentSupportService')
    private readonly paymentSupportService: PaymentSupportService,
  ) {}

  @Get('vnpay/callback')
  @ApiOperation({
    summary: 'VNPay Callback REST API (FE do not call this API)',
    description:
      'VNPay Callback REST API is endpoint for VNPay callback (FE do not call this API)',
  })
  async vnpayCallback(@Query() vnpayResponse: any, @Res() res: Response) {
    const url = await this.paymentSupportService.paymentCallback(vnpayResponse);
    return res.redirect(url);
  }

  @Post('vnpay/process-booking-payment/:bookingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Process Booking Payment REST API',
    description:
      'Process Booking Payment REST API is used to process booking payment.',
  })
  @ApiResponse({ status: 200, description: 'Return payment URL' })
  async processBookingPayment(
    @Param('bookingId') bookingId: string,
    @Body() request: ProcessBookingPaymentDto,
    @CurrentUser() info: TokenPayload,
    @Req() req: Request,
  ) {
    const ipAddress: string = req.ip!;
    return await this.paymentSupportService.buildPaymentUrl({
      userId: info.userId,
      bookingId,
      ipAddress,
      returnUrl: request.returnUrl,
    });
  }
}
