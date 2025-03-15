import { Module } from '@nestjs/common';
import { VnpayModule } from './vnPay/modules/vnpay.module';
import { PaymentSupportByVnpayService } from './payment-support-by-vnpay.service';
import { BookingServiceModule } from '../../../application/booking/booking-service.module';

@Module({
  imports: [VnpayModule, BookingServiceModule],
  providers: [
    {
      provide: 'PaymentSupportService',
      useClass: PaymentSupportByVnpayService,
    },
  ],
  exports: ['PaymentSupportService'],
})
export class PaymentModule {}
