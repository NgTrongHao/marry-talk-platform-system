import { Therapist } from '../entity/therapist.entity';
import { TherapistType } from '../entity/therapist-type.entity';
import { WorkingHours } from '../entity/working-hours.entity';
import { TherapistBalance } from '../entity/therapist-balance.entity';
import { TherapistPayoutAccount } from '../entity/therapist-payout-account.entity';

export interface TherapistRepository {
  createTherapistProfile(therapist: Therapist): Promise<Therapist>;

  getTherapistProfileByUsername(username: string): Promise<Therapist | null>;

  createTherapyTypes(types: TherapistType[]): Promise<TherapistType[]>;

  findTherapistsByTherapyId(
    therapyId: string,
    skip: number,
    take: number,
  ): Promise<{ therapist: Therapist; therapistTypes: TherapistType[] }[]>;

  getTherapistProfileById(therapistId: string): Promise<Therapist | null>;

  approveTherapistProfile(id: string): Promise<void>;

  countTherapistHasTherapyId(therapyId: string): Promise<number>;

  putTherapistWorkSchedule(
    therapistId: string,
    workSchedule: WorkingHours[],
  ): Promise<void>;

  getTherapistWorkSchedule(therapistId: string): Promise<WorkingHours[]>;

  findApprovedTherapists(
    therapyId: string | undefined,
    skip: number,
    take: number,
  ): Promise<{ therapist: Therapist; therapistTypes: TherapistType[] }[]>;

  countApprovedTherapist(therapyId: string | undefined): Promise<number>;

  findUnapprovedTherapists(
    therapyId: string | undefined,
    skip: number,
    take: number,
  ): Promise<
    {
      therapist: Therapist;
      therapistTypes: TherapistType[];
    }[]
  >;

  countUnapprovedTherapist(therapyId: string | undefined): Promise<number>;

  saveTherapistBalance(
    therapistBalance: TherapistBalance,
  ): Promise<TherapistBalance>;

  getTherapistBalance(therapistId: string): Promise<TherapistBalance | null>;

  addPayoutAccount(
    payoutAccount: TherapistPayoutAccount,
  ): Promise<TherapistPayoutAccount>;

  updateTherapistBalance(
    therapistId: string,
    amount: number,
  ): Promise<TherapistBalance>;

  getTherapistPayoutAccounts(
    therapistId: string,
  ): Promise<TherapistPayoutAccount[]>;

  getTherapistPayoutAccount(
    accountId: string,
  ): Promise<TherapistPayoutAccount | null>;

  getTherapistPayoutAccountById(
    payoutAccountId: string,
  ): Promise<TherapistPayoutAccount | null>;
}
