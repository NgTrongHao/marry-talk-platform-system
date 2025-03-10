import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../../core/domain/entity/enum/role.enum';
import { ROLES_KEY } from '../decorator/author-role.decorator';
import { TokenPayload } from '../../../application/user/service/token.service';

@Injectable()
export class RoleAuthoriseGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>() as Request & {
      user?: TokenPayload;
    };

    if (!request.user) {
      throw new ForbiddenException('User not found in request');
    }

    const userRole = request.user.role as Role;

    if (!userRole || !requiredRoles.includes(userRole)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
