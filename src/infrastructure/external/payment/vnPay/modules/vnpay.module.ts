import { Module } from '@nestjs/common';
import { VnPayConfigModule } from '../config/config.module';
import { VnpayService } from './vnpay.service';
import { UsecaseHandler } from '../../../../../application/usecase-handler.service';
import { VnpayCallbackUsecase } from './usecase/vnpay-callback.usecase';
import { BookingServiceModule } from '../../../../../application/booking/booking-service.module';

const useCases = [VnpayCallbackUsecase];

@Module({
  imports: [VnPayConfigModule, BookingServiceModule],
  providers: [
    {
      provide: 'IVnpayService',
      useClass: VnpayService,
    },
    UsecaseHandler,
    ...useCases,
  ],
  exports: [UsecaseHandler, 'IVnpayService'],
})
export class VnpayModule {}
