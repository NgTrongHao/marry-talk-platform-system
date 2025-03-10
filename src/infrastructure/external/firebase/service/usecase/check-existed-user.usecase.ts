import { Inject, Injectable } from '@nestjs/common';
import { IUsersService } from '../../../../../application/user/users-service.interface';

@Injectable()
export class CheckExistedUserUsecase {
  constructor(
    @Inject('IUsersService') private readonly userService: IUsersService,
  ) {}

  async execute(email: string, username?: string): Promise<boolean> {
    return this.userService.existsUser({ email, username });
  }
}
