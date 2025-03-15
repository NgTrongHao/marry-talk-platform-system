export interface PaymentSupportService {
  buildPaymentUrl(param: {
    userId: string;
    bookingId: string;
    ipAddress: string;
    returnUrl: string;
  }): Promise<string>;

  paymentCallback(vnpayResponse: any): Promise<string>;
}
