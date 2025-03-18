import { FlaggingReportInfoDto } from '../../../booking/service/dto/flagging-report-info.dto';
import { RequestStatus } from '../../../../core/domain/entity/enum/request-status.enum';
import { RefundRequest } from '../../../../core/domain/entity/refund-request.entity';
import { PayoutTransactionInfoDto } from './payout-transaction-info.dto';

export class RefundRequestInfoDto {
  id: string;
  report: FlaggingReportInfoDto;
  refundTo: string;
  refundAmount: number;
  refundCurrency: string;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  transaction?: PayoutTransactionInfoDto;

  constructor(
    refundRequest: RefundRequest,
    report: FlaggingReportInfoDto,
    transaction?: PayoutTransactionInfoDto,
  ) {
    this.id = refundRequest.id!;
    this.report = report;
    this.refundTo = refundRequest.refundTo;
    this.refundAmount = refundRequest.amount;
    this.refundCurrency = refundRequest.currency;
    this.status = refundRequest.status!;
    this.createdAt = refundRequest.createdAt!;
    this.updatedAt = refundRequest.updatedAt!;
    this.transaction = transaction;
  }
}
