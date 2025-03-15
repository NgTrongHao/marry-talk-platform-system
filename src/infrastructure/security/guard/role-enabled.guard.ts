import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE_ENABLED_KEY } from '../decorator/role-enabled.decorator';
import { TokenPayload } from '../../../application/user/service/token.service';

@Injectable()
export class RoleEnabledGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isRoleEnabledRequired = this.reflector.getAllAndOverride<boolean>(
      ROLE_ENABLED_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!isRoleEnabledRequired) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>() as Request & {
      user?: TokenPayload;
    };

    console.info('request', request);
    console.info('request.user', request.user);

    if (!request.user) {
      throw new ForbiddenException('User not found in request');
    }

    const { roleEnabled } = request.user;

    if (!roleEnabled) {
      throw new ForbiddenException(
        'Your role is not enabled to access this resource',
      );
    }

    return true;
  }
}
