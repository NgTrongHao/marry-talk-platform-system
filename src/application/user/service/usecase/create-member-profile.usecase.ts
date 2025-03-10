import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Role } from '../../../../core/domain/entity/enum/role.enum';
import { GetUserByUsernameUsecase } from './get-user-by-username.usecase';
import { ChangeRoleUsecase } from './change-role.usecase';
import { Member } from '../../../../core/domain/entity/member.entity';
import { MemberRepository } from '../../../../core/domain/repository/member.repository';
import { User } from '../../../../core/domain/entity/user.entity';
import { UseCase } from '../../../usecase.interface';
import { UsecaseHandler } from '../../../usecase-handler.service';

export interface CreateMemberProfileUsecaseCommand {
  username: string;
  additionalInfo: {
    birthdate?: Date;
    phoneNumber?: string;
    avatarImageURL?: string;
  };
}

@Injectable()
export class CreateMemberProfileUsecase
  implements UseCase<CreateMemberProfileUsecaseCommand, Member | undefined>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('MemberRepository') private memberRepository: MemberRepository,
  ) {}

  async execute(command: CreateMemberProfileUsecaseCommand) {
    const user = await this.usecaseHandler.execute(GetUserByUsernameUsecase, {
      username: command.username,
    });
    if (user instanceof User && user.role !== Role.REGISTRAR) {
      throw new UnauthorizedException(
        'Only registrar can create member profile',
      );
    }

    if (user instanceof User) {
      try {
        await this.usecaseHandler.execute(ChangeRoleUsecase, {
          userId: user.id!,
          role: Role.MEMBER,
        });

        const member = Member.create(
          user,
          command.additionalInfo.birthdate,
          command.additionalInfo.phoneNumber,
          command.additionalInfo.avatarImageURL,
        );

        return await this.memberRepository.createMemberProfile(member);
      } catch {
        // Roll back the role change
        await this.usecaseHandler.execute(ChangeRoleUsecase, {
          userId: user.id!,
          role: Role.REGISTRAR,
        });
        throw new ConflictException('Member profile already exists');
      }
    }
  }
}
