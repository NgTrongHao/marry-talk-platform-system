import { Module } from '@nestjs/common';
import vnpayConfig from './vnpay.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ load: [vnpayConfig], isGlobal: true })],
})
export class VnPayConfigModule {}
