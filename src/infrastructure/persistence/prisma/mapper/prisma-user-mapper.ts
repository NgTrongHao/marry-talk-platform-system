import { User } from '../../../../core/domain/entity/user.entity';
import { Prisma, Role as PrismaRole, User as PrismaUser } from '@prisma/client';
import { Role } from '../../../../core/domain/entity/enum/role.enum';

export class PrismaUserMapper {
  static toDomain(entity: PrismaUser): User {
    return User.build({
      id: entity.user_id,
      firstName: entity.first_name,
      lastName: entity.last_name,
      email: entity.email,
      username: entity.username,
      password: entity.password,
      role: PrismaUserMapper.mapPrismaRoleToDomain(entity.role),
      createdAt: entity.created_at,
      updatedAt: entity.updated_at,
    });
  }

  static toPersistence(domain: User): Prisma.UserUncheckedCreateInput {
    return {
      first_name: domain.firstName,
      last_name: domain.lastName,
      email: domain.email,
      username: domain.username,
      password: domain.password,
      role: domain.role
        ? PrismaUserMapper.mapDomainRoleToPrisma(domain.role)
        : undefined,
      created_at: domain.createdAt,
      updated_at: domain.updatedAt,
    };
  }

  static mapPrismaRoleToDomain(prismaRole: PrismaRole): Role {
    switch (prismaRole) {
      case PrismaRole.REGISTRAR:
        return Role.REGISTRAR;
      case PrismaRole.MEMBER:
        return Role.MEMBER;
      case PrismaRole.THERAPIST:
        return Role.THERAPIST;
      case PrismaRole.ADMIN:
        return Role.ADMIN;
      default:
        throw new Error(`Unknown role: ${String(prismaRole)}`);
    }
  }

  static mapDomainRoleToPrisma(domainRole: Role): PrismaRole {
    switch (domainRole) {
      case Role.REGISTRAR:
        return PrismaRole.REGISTRAR;
      case Role.MEMBER:
        return PrismaRole.MEMBER;
      case Role.THERAPIST:
        return PrismaRole.THERAPIST;
      case Role.ADMIN:
        return PrismaRole.ADMIN;
      default:
        throw new Error(`Unknown role: ${String(domainRole)}`);
    }
  }
}
