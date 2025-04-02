import { UserRepository } from '../../../../core/domain/repository/user.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User } from '../../../../core/domain/entity/user.entity';
import { PrismaUserMapper } from '../mapper/prisma-user-mapper';
import { Role } from '../../../../core/domain/entity/enum/role.enum';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async createUser(user: User): Promise<User> {
    const data = PrismaUserMapper.toPersistence(user);
    const createdUser = await this.prisma.user.create({ data });
    return PrismaUserMapper.toDomain(createdUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  async save(user: User): Promise<User> {
    const data = PrismaUserMapper.toPersistence(user);
    const updatedUser = await this.prisma.user.upsert({
      where: { username: user.username },
      create: data,
      update: data,
    });
    return PrismaUserMapper.toDomain(updatedUser);
  }

  async findById(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { user_id: userId },
    });
    return user ? PrismaUserMapper.toDomain(user) : null;
  }

  countTotalUsers(
    startDate: Date | undefined,
    endDate: Date | undefined,
  ): Promise<number> {
    // if startDate and endDate are not provided, return total users
    if (!startDate && !endDate) {
      return this.prisma.user.count();
    }

    // return total users within the date range
    return this.prisma.user.count({
      where: {
        created_at: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async findAll(skip: number, take: number): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      skip,
      take,
    });
    return users.map((user) => PrismaUserMapper.toDomain(user));
  }

  getTotalUsers(
    fromDate: Date | undefined,
    toDate: Date | undefined,
    role: Role | undefined,
  ): Promise<number> {
    // const startOfMonth = new Date(
    //   new Date().getFullYear(),
    //   new Date().getMonth(),
    //   1,
    // );
    // const endOfMonth = new Date(
    //   new Date().getFullYear(),
    //   new Date().getMonth() + 1,
    //   0,
    // );

    return this.prisma.user.count({
      where: {
        created_at: {
          gte: fromDate,
          lte: toDate,
        },
        role: role ?? undefined,
      },
    });
  }

  // async createMemberProfile(member: Member): Promise<Member> {
  //   const user = await this.prisma.user.findUnique({
  //     where: { user_id: member.user.id },
  //   });
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   user.role = 'MEMBER';
  //   user.phone_number = member.phoneNumber ?? null;
  //   user.avatar_image = member.avatarImageURL ?? null;
  //   user.birth_date = member.birthdate ?? null;
  //
  //   const updatedUser = await this.prisma.user.update({
  //     where: { user_id: user.user_id },
  //     data: user,
  //   });
  //
  //   return PrismaMemberMapper.toDomain(updatedUser);
  // }
  //
  // async getMemberProfileByUsername(username: string): Promise<Member | null> {
  //   return this.prisma.user
  //     .findUnique({
  //       where: { username },
  //     })
  //     .then((user) => {
  //       if (!user) {
  //         return null;
  //       }
  //
  //       return PrismaMemberMapper.toDomain(user);
  //     });
  // }
  //
  // async createTherapistProfile(therapist-management: Therapist): Promise<Therapist> {
  //   const user = await this.prisma.user.findUnique({
  //     where: { user_id: therapist-management.user.id },
  //   });
  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   user.role = 'THERAPIST';
  //   user.phone_number = therapist-management.phoneNumber ?? null;
  //   user.avatar_image = therapist-management.avatarImageURL ?? null;
  //   user.birth_date = therapist-management.birthdate ?? null;
  //   user.expert_certificate = therapist-management.expertCertificates;
  //   user.professional_experience = therapist-management.professionalExperience ?? null;
  //   user.bio = therapist-management.bio ?? null;
  //
  //   const updatedUser = await this.prisma.user.update({
  //     where: { user_id: user.user_id },
  //     data: user,
  //   });
  //
  //   return PrismaTherapistMapper.toDomain(updatedUser);
  // }
  //
  // async getTherapistProfileByUsername(
  //   username: string,
  // ): Promise<Therapist | null> {
  //   const user = await this.prisma.user.findUnique({
  //     where: { username },
  //   });
  //   if (!user) {
  //     return null;
  //   }
  //   return PrismaTherapistMapper.toDomain(user);
  // }
}
