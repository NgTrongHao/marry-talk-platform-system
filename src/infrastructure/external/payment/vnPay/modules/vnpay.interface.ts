import { BookingPaymentInfoDto } from '../../../../../application/booking/service/dto/booking-payment-info.dto';

export interface IVnpayService {
  getBankList(): Promise<any>;

  buildPaymentUrl(data: BookingPaymentInfoDto, ipAddress: string): string;

  verifyReturnUrl(query: any): Promise<any>;

  verifyIpnCall(query: any): Promise<boolean>;

  queryDr(data: any): Promise<any>;

  refund(data: any): Promise<any>;

  paymentCallback(vnpayResponse: any): Promise<string>;
}
