import { RefundRequest } from '../entity/refund-request.entity';

export interface RefundRequestRepository {
  save(refundRequest: RefundRequest): Promise<RefundRequest>;

  getRefundRequestByReportId(reportId: string): Promise<RefundRequest | null>;

  getRefundRequestsByUserId(userId: string): Promise<RefundRequest[]>;

  findByBookingId(bookingId: string): Promise<RefundRequest | null>;

  getRefundRequestById(refundRequestId: string): Promise<RefundRequest | null>;

  getAllRefundRequests(
    page: number,
    limit: number,
    status: string | undefined,
    userId: string | undefined,
  ): Promise<RefundRequest[]>;

  countAllRefundRequests(
    status: string | undefined,
    userId: string | undefined,
  ): Promise<number>;
}
