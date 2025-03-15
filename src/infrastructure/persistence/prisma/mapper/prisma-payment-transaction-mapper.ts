import { Booking as PrismaBooking, Transaction } from '@prisma/client';
import { PaymentTransaction } from '../../../../core/domain/entity/payment-transaction.entity';
import { PrismaBookingMapper } from './prisma-booking-mapper';
import { TransactionType } from '../../../../core/domain/entity/enum/transaction-type.enum';
import { ReferenceTransactionStatusEnum } from '../../../../core/domain/entity/enum/reference-transaction-status.enum';
import {
  ServicePackage as PrismaServicePackage,
  TherapistService as PrismaTherapistService,
} from '.prisma/client';
import { ConflictException } from '@nestjs/common';

export class PrismaPaymentTransactionMapper {
  static toDomain(
    entity: Transaction & {
      payment:
        | (PrismaBooking & {
            therapistService: PrismaTherapistService & {
              package: PrismaServicePackage;
            };
          })
        | null;
    },
  ): PaymentTransaction {
    if (!entity.payment) {
      throw new ConflictException(
        'Payment transaction does not have a booking',
      );
    }
    return PaymentTransaction.build({
      id: entity.transaction_id,
      amount: entity.amount.toNumber(),
      currency: entity.currency,
      booking: PrismaBookingMapper.toDomain(entity.payment),
      transactionType: entity.type as TransactionType,
      transactionStatus: entity.status as ReferenceTransactionStatusEnum,
      returnUrl: entity.return_url ?? undefined,
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
      referenceTransactionId: entity.reference_transaction_id,
      changedBy: (entity.changed_by as string) ?? undefined,
    });
  }
}
