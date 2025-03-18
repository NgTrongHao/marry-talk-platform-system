import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { ProgressStatus } from '../../../../core/domain/entity/enum/progress-status.enum';
import { UseCase } from '../../../usecase.interface';
import { Booking } from '../../../../core/domain/entity/booking.entity';
import { BookingRepository } from '../../../../core/domain/repository/booking.repository';
import { IUsersService } from '../../../user/users-service.interface';
import { Role } from '../../../../core/domain/entity/enum/role.enum';

interface GetMemberBookingsUsecaseCommand {
  memberId: string;
  page: number;
  limit: number;
  status: ProgressStatus | undefined;
  fromDate: Date | undefined;
  toDate: Date | undefined;
}

@Injectable()
export class GetMemberBookingsUsecase
  implements UseCase<GetMemberBookingsUsecaseCommand, Booking[]>
{
  constructor(
    @Inject('BookingRepository') private bookingRepository: BookingRepository,
    @Inject('IUsersService') private readonly userService: IUsersService,
  ) {}

  async execute(command: GetMemberBookingsUsecaseCommand): Promise<Booking[]> {
    const user = await this.userService.getUserById({
      userId: command.memberId,
    });

    if (user.role !== Role.MEMBER.toString()) {
      throw new ConflictException('User is not a member');
    }

    return this.bookingRepository.getUserBookings(
      command.memberId,
      command.page,
      command.limit,
      command.status,
      command.fromDate,
      command.toDate,
    );
  }
}
