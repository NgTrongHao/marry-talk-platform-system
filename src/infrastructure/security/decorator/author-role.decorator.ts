import { Role } from '../../../core/domain/entity/enum/role.enum';
import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const AuthorRole = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
