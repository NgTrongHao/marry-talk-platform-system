import { Injectable } from '@nestjs/common';
import { VNPay, VNPayConfig, VnpCurrCode, VnpLocale } from 'vnpay';
import { ConfigService } from '@nestjs/config';
import { IVnpayService } from './vnpay.interface';
import { UsecaseHandler } from '../../../../../application/usecase-handler.service';
import { VnpayCallbackUsecase } from './usecase/vnpay-callback.usecase';
import { formatDateTimeToCompatFormat } from '../../../../../application/shared/utils/date-time-format.utils';
import { BookingPaymentInfoDto } from '../../../../../application/booking/service/dto/booking-payment-info.dto';

interface ExtendedVNPayConfig extends VNPayConfig {
  hashSecret: string;
  apiUrl: string;
  returnUrl: string;
}

@Injectable()
export class VnpayService implements IVnpayService {
  private readonly vnpay: VNPay;

  constructor(
    private readonly configService: ConfigService,
    private useCaseHandler: UsecaseHandler,
  ) {
    const tmnCode = this.configService.get<string>('vnpay.tmnCode');
    const hashSecret = this.configService.get<string>('vnpay.hashSecret');
    const apiUrl = this.configService.get<string>('vnpay.apiUrl');
    const returnUrl = this.configService.get<string>('vnpay.returnUrl');

    if (!tmnCode || !hashSecret || !apiUrl || !returnUrl) {
      throw new Error('VNPay configuration is missing');
    }

    const config: ExtendedVNPayConfig = {
      tmnCode,
      secureSecret: hashSecret,
      hashSecret,
      apiUrl,
      returnUrl,
    };

    this.vnpay = new VNPay(config as VNPayConfig);
  }

  get instance(): VNPay {
    if (!this.vnpay) {
      throw new Error('VNPay instance is not initialized');
    }
    return this.vnpay;
  }

  async getBankList(): Promise<any> {
    return await this.vnpay.getBankList();
  }

  buildPaymentUrl(data: BookingPaymentInfoDto, ipAddress: string): string {
    return this.vnpay.buildPaymentUrl({
      vnp_TxnRef: data.bookingId,
      vnp_Amount: data.amount,
      vnp_CurrCode: data.currency as VnpCurrCode,
      vnp_OrderInfo:
        'Payment at MarryTalk for booking ' +
        data.serviceName +
        ' with therapist ' +
        data.therapistName,
      vnp_ReturnUrl: this.configService.get<string>('vnpay.returnUrl')!,
      vnp_Locale: VnpLocale.VN,
      vnp_ExpireDate: Number(
        formatDateTimeToCompatFormat(new Date(Date.now() + 10 * 60 * 1000)), // 10 minutes
      ),
      vnp_IpAddr: ipAddress, // ip address of client
    });
  }

  verifyReturnUrl(query: any): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.vnpay.verifyReturnUrl(query);
  }

  verifyIpnCall(query: any): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.vnpay.verifyIpnCall(query);
  }

  async queryDr(data: any): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return await this.vnpay.queryDr(data);
  }

  async refund(data: any): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return await this.vnpay.refund(data);
  }

  async paymentCallback(vnpayResponse: any): Promise<string> {
    return this.useCaseHandler.execute(VnpayCallbackUsecase, vnpayResponse);
  }
}
