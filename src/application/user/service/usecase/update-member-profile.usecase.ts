import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { Member } from '../../../../core/domain/entity/member.entity';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { MemberRepository } from '../../../../core/domain/repository/member.repository';
import { GetUserByUsernameUsecase } from './get-user-by-username.usecase';
import { User } from '../../../../core/domain/entity/user.entity';

interface UpdateMemberProfileUsecaseCommand {
  username: string;
  additionalInfo: {
    birthdate?: Date;
    phoneNumber?: string;
    avatarImageURL?: string;
  };
}

@Injectable()
export class UpdateMemberProfileUsecase
  implements UseCase<UpdateMemberProfileUsecaseCommand, Member>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('MemberRepository') private memberRepository: MemberRepository,
  ) {}

  async execute(command: UpdateMemberProfileUsecaseCommand) {
    const user = await this.usecaseHandler.execute(GetUserByUsernameUsecase, {
      username: command.username,
    });

    if (!(user instanceof Member)) {
      throw new BadRequestException('User not found or not a member');
    }

    const member = await this.memberRepository.getMemberProfileByUsername(
      user.user.username,
    );
    if (!member) {
      throw new BadRequestException('Member profile not found');
    }

    if (command.additionalInfo.birthdate !== undefined) {
      member.birthdate = new Date(command.additionalInfo.birthdate);
    }
    if (command.additionalInfo.phoneNumber !== undefined) {
      member.phoneNumber = command.additionalInfo.phoneNumber;
    }
    if (command.additionalInfo.avatarImageURL !== undefined) {
      member.avatarImageURL = command.additionalInfo.avatarImageURL;
    }

    return await this.memberRepository.saveMemberProfile(member);
  }
}
