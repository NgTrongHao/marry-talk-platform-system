import { TokenService } from '../token.service';
import { User } from '../../../../core/domain/entity/user.entity';
import { Inject } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';

export class GenerateAccessTokenUsecase implements UseCase<User, string> {
  constructor(
    @Inject('TokenService') private readonly tokenService: TokenService,
  ) {}

  execute(user: User): Promise<string> {
    return this.tokenService.generateToken({
      userId: user.id as string,
      username: user.username,
      role: user.role as string,
    });
  }
}
