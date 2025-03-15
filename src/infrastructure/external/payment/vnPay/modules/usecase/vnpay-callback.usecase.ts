import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../../../../application/usecase.interface';
import { IVnpayService } from '../vnpay.interface';
import { IBookingService } from '../../../../../../application/booking/booking-service.interface';

@Injectable()
export class VnpayCallbackUsecase implements UseCase<any, string> {
  constructor(
    @Inject('IVnpayService') private vnpayService: IVnpayService,
    @Inject('IBookingService') private readonly bookingService: IBookingService,
  ) {}

  async execute(vnpayResponse: any): Promise<string> {
    console.log('vnpayResponse', vnpayResponse);

    const verifiedData = (await this.vnpayService.verifyReturnUrl(
      vnpayResponse,
    )) as {
      vnp_TxnRef: string;
      vnp_ResponseCode: string;
      vnp_Amount: string;
      vnp_CurrCode: string;
      vnp_TransactionNo: string;
      vnp_BankCode: string;
      vnp_PayDate: string;
    };

    const {
      vnp_TxnRef,
      vnp_ResponseCode,
      vnp_BankCode,
      vnp_CurrCode,
      vnp_TransactionNo,
      vnp_PayDate,
      vnp_Amount,
    } = verifiedData;

    const responseMessages: Record<string, string> = {
      '00': 'Giao dịch thành công',
      '07': 'Giao dịch bị nghi ngờ (lừa đảo, giao dịch bất thường)',
      '09': 'Thẻ/Tài khoản chưa đăng ký InternetBanking',
      '10': 'Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Hết hạn chờ thanh toán',
      '12': 'Thẻ/Tài khoản bị khóa',
      '13': 'Sai mật khẩu OTP',
      '24': 'Khách hàng hủy giao dịch',
      '51': 'Tài khoản không đủ số dư',
      '65': 'Tài khoản vượt hạn mức giao dịch trong ngày',
      '75': 'Ngân hàng thanh toán đang bảo trì',
      '79': 'Sai mật khẩu thanh toán quá số lần quy định',
      '99': 'Lỗi không xác định',
    };

    const message = responseMessages[vnp_ResponseCode] || 'Lỗi không xác định';

    if (vnp_ResponseCode === '00') {
      return this.bookingService.handlePaymentResult({
        paymentGateway: 'vnpay',
        txnRef: vnp_TxnRef,
        responseCode: vnp_ResponseCode,
        amount: vnp_Amount,
        currency: vnp_CurrCode,
        transactionNo: vnp_TransactionNo,
        bankCode: vnp_BankCode,
        payDate: vnp_PayDate,
        isSuccessful: true,
        message,
      });
    } else {
      return this.bookingService.handlePaymentResult({
        paymentGateway: 'vnpay',
        txnRef: vnp_TxnRef,
        responseCode: vnp_ResponseCode,
        amount: vnp_Amount,
        currency: vnp_CurrCode,
        transactionNo: vnp_TransactionNo,
        bankCode: vnp_BankCode,
        payDate: vnp_PayDate,
        isSuccessful: false,
        message,
      });
    }
  }
}
