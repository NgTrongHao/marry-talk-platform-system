import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../../../core/domain/repository/user.repository';
import { GetUserByIdUsecase } from './get-user-by-id.usecase';
import {
  Role,
  valueOfRole,
} from '../../../../core/domain/entity/enum/role.enum';
import { UseCase } from '../../../usecase.interface';
import { UsecaseHandler } from '../../../usecase-handler.service';

export interface ChangeRoleUsecaseCommand {
  userId: string;
  role: string;
  isRollback?: boolean;
}

@Injectable()
export class ChangeRoleUsecase
  implements UseCase<ChangeRoleUsecaseCommand, void>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('UserRepository') private userRepository: UserRepository,
  ) {}

  async execute(command: ChangeRoleUsecaseCommand) {
    const user = await this.usecaseHandler.execute(GetUserByIdUsecase, {
      userId: command.userId,
    });

    if (
      user.role !== Role.REGISTRAR &&
      user.role !== Role.ADMIN &&
      !command.isRollback
    ) {
      throw new UnauthorizedException(
        'Only registrar or admin can change role',
      );
    }

    // user.setRole(valueOfRole(command.role));

    user.role = valueOfRole(command.role);

    await this.userRepository.save(user);
  }
}
