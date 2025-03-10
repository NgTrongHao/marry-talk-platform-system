import { User as PrismaMember } from '@prisma/client';
import { Member } from '../../../../core/domain/entity/member.entity';
import { PrismaUserMapper } from './prisma-user-mapper';

export class PrismaMemberMapper {
  static toDomain(entity: PrismaMember): Member {
    return Member.build({
      user: PrismaUserMapper.toDomain(entity),
      birthdate: entity.birth_date!,
      phoneNumber: entity.phone_number!,
      avatarImageURL: entity.avatar_image!,
    });
  }
}
