import { Inject, Injectable } from '@nestjs/common';
import { Role } from '../../../../core/domain/entity/enum/role.enum';
import { UserRepository } from '../../../../core/domain/repository/user.repository';
import { UseCase } from '../../../usecase.interface';

interface GetTotalUsersUsecaseCommand {
  fromDate: Date | undefined;
  toDate: Date | undefined;
  role: Role | undefined;
}

@Injectable()
export class GetTotalUsersUsecase
  implements UseCase<GetTotalUsersUsecaseCommand, number>
{
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: GetTotalUsersUsecaseCommand): Promise<number> {
    return this.userRepository.getTotalUsers(
      command.fromDate,
      command.toDate,
      command.role,
    );
  }
}
