import { PaymentSupportService } from '../../../application/booking/service/payment-support.service';
import { Inject, Injectable } from '@nestjs/common';
import { IVnpayService } from './vnPay/modules/vnpay.interface';
import { IBookingService } from '../../../application/booking/booking-service.interface';

@Injectable()
export class PaymentSupportByVnpayService implements PaymentSupportService {
  constructor(
    @Inject('IVnpayService') private vnpayService: IVnpayService,
    @Inject('IBookingService') private readonly bookingService: IBookingService,
  ) {}

  async buildPaymentUrl(param: {
    userId: string;
    bookingId: string;
    ipAddress: string;
    returnUrl: string;
  }): Promise<string> {
    const paymentInfo = await this.bookingService.processBookingPayment({
      userId: param.userId,
      bookingId: param.bookingId,
      ipAddress: param.ipAddress,
      returnUrl: param.returnUrl,
    });
    return this.vnpayService.buildPaymentUrl(paymentInfo, param.ipAddress);
  }

  paymentCallback(vnpayResponse: any): Promise<string> {
    return this.vnpayService.paymentCallback(vnpayResponse);
  }
}
