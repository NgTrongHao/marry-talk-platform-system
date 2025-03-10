import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../../../../core/domain/repository/member.repository';
import { PrismaService } from '../prisma.service';
import { Member } from '../../../../core/domain/entity/member.entity';
import { PrismaMemberMapper } from '../mapper/prisma-member-mapper';

@Injectable()
export class PrismaMemberRepository implements MemberRepository {
  constructor(private prisma: PrismaService) {}

  async createMemberProfile(member: Member): Promise<Member> {
    const updatedUser = await this.prisma.user.update({
      where: { user_id: member.user.id },
      data: {
        phone_number: member.phoneNumber ?? null,
        avatar_image: member.avatarImageURL ?? null,
        birth_date: member.birthdate ?? null,
      },
    });

    return PrismaMemberMapper.toDomain(updatedUser);
  }

  async getMemberProfileByUsername(username: string): Promise<Member | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    return user ? PrismaMemberMapper.toDomain(user) : null;
  }
}
