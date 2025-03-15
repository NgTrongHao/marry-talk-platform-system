import { TherapistPayoutAccount } from '../../../../core/domain/entity/therapist-payout-account.entity';

export class TherapistPayoutAccountInfoDto {
  accountNumber: string;
  bankCode: string;
  accountName: string;

  constructor(therapistPayoutAccount: TherapistPayoutAccount) {
    this.accountNumber = therapistPayoutAccount.accountNumber;
    this.bankCode = therapistPayoutAccount.bankCode!;
    this.accountName = therapistPayoutAccount.accountName ?? '';
  }
}
