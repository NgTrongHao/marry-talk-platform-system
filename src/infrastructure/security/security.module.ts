import { Module } from '@nestjs/common';
import { BcryptService } from './hashing/bcrypt.service';
import { JwtTokenService } from './token/jwt-token.service';

@Module({
  providers: [
    {
      provide: 'HashPasswordService',
      useClass: BcryptService,
    },
    {
      provide: 'TokenService',
      useClass: JwtTokenService,
    },
  ],
  exports: ['HashPasswordService', 'TokenService'],
})
export class SecurityModule {}
