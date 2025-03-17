import { TherapistPayoutAccount } from '../../../../core/domain/entity/therapist-payout-account.entity';

export class TherapistPayoutAccountInfoDto {
  id: string;
  accountNumber: string;
  bankCode: string;
  accountName: string;

  constructor(therapistPayoutAccount: TherapistPayoutAccount) {
    this.id = therapistPayoutAccount.id!;
    this.accountNumber = therapistPayoutAccount.accountNumber;
    this.bankCode = therapistPayoutAccount.bankCode!;
    this.accountName = therapistPayoutAccount.accountName ?? '';
  }
}
