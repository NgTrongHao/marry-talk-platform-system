export class BookingPaymentInfoDto {
  bookingId: string;
  userName: string;
  therapistName: string;
  serviceName: string;
  amount: number;
  currency: string;

  constructor(
    bookingId: string,
    userName: string,
    therapistName: string,
    serviceName: string,
    amount: number,
    currency: string,
  ) {
    this.bookingId = bookingId;
    this.userName = userName;
    this.therapistName = therapistName;
    this.serviceName = serviceName;
    this.amount = amount;
    this.currency = currency;
  }
}
