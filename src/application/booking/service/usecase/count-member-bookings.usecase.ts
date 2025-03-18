import { UseCase } from '../../../usecase.interface';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';
import { IUsersService } from '../../../user/users-service.interface';
import { Role } from '../../../../core/domain/entity/enum/role.enum';

interface CountMemberBookingsUsecaseCommand {
  memberId: string;
  status?: ProgressStatus;
  from?: Date;
  to?: Date;
}

@Injectable()
export class CountMemberBookingsUsecase
  implements UseCase<CountMemberBookingsUsecaseCommand, number>
{
  constructor(
    @Inject('BookingRepository') private bookingRepository: BookingRepository,
    @Inject('IUsersService') private readonly userService: IUsersService,
  ) {}

  async execute(command: CountMemberBookingsUsecaseCommand): Promise<number> {
    const user = await this.userService.getUserById({
      userId: command.memberId,
    });

    if (user.role !== Role.MEMBER.toString()) {
      throw new ConflictException('User is not a member');
    }

    return await this.bookingRepository.countUserBookings(
      command.memberId,
      command.status,
      command.from,
      command.to,
    );
  }
}
