import { TherapistBalance } from '../../../../core/domain/entity/therapist-balance.entity';

export class TherapistBalanceInfoDto {
  therapistId: string;
  balance: number;
  updatedAt: Date;

  constructor(therapistBalance: TherapistBalance) {
    this.therapistId = therapistBalance.therapistId;
    this.balance = therapistBalance.balance;
    this.updatedAt = therapistBalance.updatedAt!;
  }
}
