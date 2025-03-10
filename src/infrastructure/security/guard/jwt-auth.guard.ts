import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  TokenPayload,
  TokenService,
} from '../../../application/user/service/token.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('TokenService') private readonly tokenService: TokenService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>() as Request & {
      user?: TokenPayload;
    };

    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    const token = tokenParts[1];
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      request.user = this.tokenService.verifyToken(token);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
