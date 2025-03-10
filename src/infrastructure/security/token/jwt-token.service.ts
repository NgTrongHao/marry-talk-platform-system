import * as jwt from 'jsonwebtoken';
import {
  TokenPayload,
  TokenService,
} from '../../../application/user/service/token.service';

export class JwtTokenService implements TokenService {
  generateToken(payload: TokenPayload): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.JWT_SECRET!,
        {
          expiresIn: process.env.JWT_EXPIRATION,
        },
        (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token!);
          }
        },
      );
    });
  }

  verifyToken(token: string): TokenPayload {
    return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
  }
}
