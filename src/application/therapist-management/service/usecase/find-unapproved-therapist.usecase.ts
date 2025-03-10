import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { Therapist } from '../../../../core/domain/entity/therapist.entity';
import { TherapistType } from '../../../../core/domain/entity/therapist-type.entity';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';

interface FindUnapprovedTherapistUsecaseCommand {
  therapyId?: string;
  skip: number;
  take: number;
}

@Injectable()
export class FindUnapprovedTherapistUsecase
  implements
    UseCase<
      FindUnapprovedTherapistUsecaseCommand,
      {
        therapist: Therapist;
        therapistTypes: TherapistType[];
      }[]
    >
{
  constructor(
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(command: FindUnapprovedTherapistUsecaseCommand): Promise<
    {
      therapist: Therapist;
      therapistTypes: TherapistType[];
    }[]
  > {
    return await this.therapistRepository.findUnapprovedTherapists(
      command.therapyId,
      command.skip,
      command.take,
    );
  }
}
