import {
  TherapistType as PrismaTherapistType,
  User as PrismaTherapist,
} from '@prisma/client';
import { PrismaUserMapper } from './prisma-user-mapper';
import { Therapist } from '../../../../core/domain/entity/therapist.entity';
import { TherapistType } from '../../../../core/domain/entity/therapist-type.entity';

export class PrismaTherapistMapper {
  static toDomain(
    entity: PrismaTherapist & { therapistType: PrismaTherapistType[] },
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
    });
  }
}
