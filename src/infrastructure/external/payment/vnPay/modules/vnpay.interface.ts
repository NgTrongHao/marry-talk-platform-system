import { BookingPaymentInfoDto } from '../../../../../application/booking/service/dto/booking-payment-info.dto';

export interface IVnpayService {
  getBankList(): Promise<{
    bank_code: string;
    bank_name: string;
    logo_link: string;
    bank_type: number;
    display_order: number;
  }>;

  buildPaymentUrl(data: BookingPaymentInfoDto, ipAddress: string): string;

  verifyReturnUrl(query: any): Promise<any>;

  verifyIpnCall(query: any): Promise<boolean>;

  queryDr(data: any): Promise<any>;

  refund(data: any): Promise<any>;

  paymentCallback(vnpayResponse: any): Promise<string>;
}
