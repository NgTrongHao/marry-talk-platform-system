import {
  TherapistBalance as PrismaTherapistBalance,
  TherapistPayoutAccount as PrismaTherapistPayoutAccount,
  TherapistType as PrismaTherapistType,
  User as PrismaTherapist,
} from '@prisma/client';
import { PrismaUserMapper } from './prisma-user-mapper';
import { Therapist } from '../../../../core/domain/entity/therapist.entity';
import { TherapistType } from '../../../../core/domain/entity/therapist-type.entity';
import { TherapistBalance } from '../../../../core/domain/entity/therapist-balance.entity';
import { TherapistPayoutAccount } from '../../../../core/domain/entity/therapist-payout-account.entity';

export class PrismaTherapistMapper {
  static toDomain(
    entity: PrismaTherapist & { therapistType: PrismaTherapistType[] },
    rating: number,
  ): Therapist {
    return Therapist.build({
      user: PrismaUserMapper.toDomain(entity),
      bio: entity.bio!,
      expertCertificates: entity.expert_certificate,
      professionalExperience: entity.professional_experience!,
      birthdate: entity.birth_date!,
      phoneNumber: entity.phone_number!,
      avatarImageURL: entity.avatar_image!,
      roleEnabled: entity.role_enabled,
      therapistTypes: entity.therapistType.map((type) =>
        TherapistType.build({
          therapistId: type.therapist_id,
          therapyCategoryId: type.therapy_id,
          enable: type.enabled,
        }),
      ),
      rating: rating,
    });
  }

  static toTherapistBalanceDomain(
    entity: PrismaTherapistBalance,
  ): TherapistBalance {
    return TherapistBalance.build({
      therapistId: entity.therapist_id,
      balance: Number(entity.balance),
      updatedAt: entity.updated_at,
    });
  }

  static toTherapistPayoutAccountDomain(
    entity: PrismaTherapistPayoutAccount,
  ): TherapistPayoutAccount {
    return TherapistPayoutAccount.build({
      id: entity.id,
      therapistId: entity.therapist_id,
      accountNumber: entity.account_number,
      bankCode: entity.bank_code ?? undefined,
      accountName: entity.account_name ?? undefined,
      createdAt: entity.created_at,
    });
  }
}
