import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from '../../../application/user/service/token.service';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): TokenPayload => {
    const request = context.switchToHttp().getRequest<{ user: TokenPayload }>();
    return request.user;
  },
);
