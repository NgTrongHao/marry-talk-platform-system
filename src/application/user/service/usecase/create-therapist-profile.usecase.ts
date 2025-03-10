import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GetUserByUsernameUsecase } from './get-user-by-username.usecase';
import { ChangeRoleUsecase } from './change-role.usecase';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';
import { Role } from '../../../../core/domain/entity/enum/role.enum';
import { Therapist } from '../../../../core/domain/entity/therapist.entity';
import { User } from '../../../../core/domain/entity/user.entity';
import { UseCase } from '../../../usecase.interface';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { CreateTherapistTypeUsecase } from './create-therapist-type.usecase';

export interface CreateTherapistProfileUsecaseCommand {
  username: string;
  additionalInfo: {
    birthdate?: Date;
    phoneNumber?: string;
    avatarImageURL?: string;
    bio?: string;
    expertCertificates: string[];
    professionalExperience?: string;
    therapistTypes: string[];
  };
}

@Injectable()
export class CreateTherapistProfileUsecase
  implements
    UseCase<CreateTherapistProfileUsecaseCommand, Therapist | undefined>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(command: CreateTherapistProfileUsecaseCommand) {
    const user = await this.usecaseHandler.execute(GetUserByUsernameUsecase, {
      username: command.username,
    });
    if (user instanceof User && user.role !== Role.REGISTRAR) {
      throw new UnauthorizedException(
        'Only registrar can create therapist-management profile',
      );
    }

    if (user instanceof User) {
      try {
        await this.usecaseHandler.execute(ChangeRoleUsecase, {
          userId: user.id!,
          role: Role.THERAPIST,
        });

        // let therapist-management: Therapist | null;
        const therapist = Therapist.create(
          user,
          command.additionalInfo.expertCertificates,
          command.additionalInfo.therapistTypes,
          command.additionalInfo.birthdate,
          command.additionalInfo.phoneNumber,
          command.additionalInfo.avatarImageURL,
          command.additionalInfo.bio,
          command.additionalInfo.professionalExperience,
        );

        // const savedTherapist =
        //   await this.therapistRepository.createTherapistProfile(therapist-management);
        //
        // await this.usecaseHandler.execute(
        //   CreateTherapistTypeUsecase,
        //   therapist-management.therapistTypes,
        // );

        const [savedTherapist] = await Promise.all([
          this.therapistRepository.createTherapistProfile(therapist),
          this.usecaseHandler.execute(
            CreateTherapistTypeUsecase,
            therapist.therapistTypes,
          ),
        ]);

        return savedTherapist;
      } catch (error) {
        // Roll back the role change
        await this.usecaseHandler.execute(ChangeRoleUsecase, {
          userId: user.id!,
          role: Role.REGISTRAR,
        });
        throw new BadRequestException(
          'Failed to create therapist-management profile' + error,
        );
      }
    }
  }
}
