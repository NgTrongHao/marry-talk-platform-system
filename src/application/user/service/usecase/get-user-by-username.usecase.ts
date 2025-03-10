import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../../core/domain/repository/user.repository';
import { User } from '../../../../core/domain/entity/user.entity';
import { Role } from '../../../../core/domain/entity/enum/role.enum';
import { MemberRepository } from '../../../../core/domain/repository/member.repository';
import { Member } from '../../../../core/domain/entity/member.entity';
import { Therapist } from '../../../../core/domain/entity/therapist.entity';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';
import { UseCase } from '../../../usecase.interface';

export interface GetUserUseCaseCommand {
  username: string;
}

@Injectable()
export class GetUserByUsernameUsecase
  implements UseCase<GetUserUseCaseCommand, User | Member | Therapist>
{
  constructor(
    @Inject('UserRepository') private userRepository: UserRepository,
    @Inject('MemberRepository') private memberRepository: MemberRepository,
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(
    command: GetUserUseCaseCommand,
  ): Promise<User | Member | Therapist> {
    const user = await this.userRepository.findByUsername(command.username);

    if (user == null) {
      throw new NotFoundException(
        'User not found by username: ' + command.username,
      );
    }

    switch (user.role) {
      case Role.REGISTRAR:
        return user;
      case Role.MEMBER: {
        const member = await this.memberRepository.getMemberProfileByUsername(
          user.username,
        );
        if (member == null) {
          throw new NotFoundException(
            'Member not found by username: ' + command.username,
          );
        }
        return member;
      }
      case Role.THERAPIST: {
        const therapist =
          await this.therapistRepository.getTherapistProfileByUsername(
            user.username,
          );
        if (therapist == null) {
          throw new NotFoundException(
            'Therapist not found by username: ' + command.username,
          );
        }
        return therapist;
      }
      default: {
        return user;
      }
    }
  }
}
