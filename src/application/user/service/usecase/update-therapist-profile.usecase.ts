import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { Therapist } from '../../../../core/domain/entity/therapist.entity';
import { UsecaseHandler } from '../../../usecase-handler.service';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';
import { ITherapyManagementService } from '../../../therapy-management/therapy-management-service.interface';
import { GetUserByUsernameUsecase } from './get-user-by-username.usecase';
import { User } from '../../../../core/domain/entity/user.entity';
import { CreateTherapistTypeUsecase } from './create-therapist-type.usecase';

interface UpdateTherapistProfileUsecaseCommand {
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
export class UpdateTherapistProfileUsecase
  implements UseCase<UpdateTherapistProfileUsecaseCommand, Therapist>
{
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
    @Inject('ITherapyManagementService')
    private therapyManagementService: ITherapyManagementService,
  ) {}

  async execute(command: UpdateTherapistProfileUsecaseCommand) {
    const user = await this.usecaseHandler.execute(GetUserByUsernameUsecase, {
      username: command.username,
    });

    if (!(user instanceof Therapist)) {
      throw new BadRequestException('User not found or not a therapist');
    }

    const therapist =
      await this.therapistRepository.getTherapistProfileByUsername(
        user.user.username,
      );
    if (!therapist) {
      throw new BadRequestException('Therapist profile not found');
    }

    if (command.additionalInfo.birthdate !== undefined) {
      therapist.birthdate = new Date(command.additionalInfo.birthdate);
    }

    if (command.additionalInfo.phoneNumber !== undefined) {
      therapist.phoneNumber = command.additionalInfo.phoneNumber;
    }

    if (command.additionalInfo.avatarImageURL !== undefined) {
      therapist.avatarImageURL = command.additionalInfo.avatarImageURL;
    }

    if (command.additionalInfo.bio !== undefined) {
      therapist.bio = command.additionalInfo.bio;
    }

    if (command.additionalInfo.expertCertificates !== undefined) {
      therapist.expertCertificates = command.additionalInfo.expertCertificates;
    }

    if (command.additionalInfo.professionalExperience !== undefined) {
      therapist.professionalExperience =
        command.additionalInfo.professionalExperience;
    }

    if (command.additionalInfo.therapistTypes !== undefined) {
      for (const therapistType of command.additionalInfo.therapistTypes) {
        if (
          !(await this.therapyManagementService.getTherapyCategoryById({
            id: therapistType,
          }))
        ) {
          throw new BadRequestException(
            `Therapist type ${therapistType} does not exist`,
          );
        }
      }
      therapist.therapistTypes = command.additionalInfo.therapistTypes;
    }

    const [savedTherapist] = await Promise.all([
      this.therapistRepository.saveTherapistProfile(therapist),
      this.usecaseHandler.execute(
        CreateTherapistTypeUsecase,
        therapist.therapistTypes,
      ),
    ]);

    return savedTherapist;
  }
}
