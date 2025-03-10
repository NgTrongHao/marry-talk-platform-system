import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { Therapist } from '../../../../core/domain/entity/therapist.entity';
import { TherapistType } from '../../../../core/domain/entity/therapist-type.entity';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';

interface FindApprovedTherapistUsecaseCommand {
  therapyId?: string;
  skip: number;
  take: number;
}

@Injectable()
export class FindApprovedTherapistUsecase
  implements
    UseCase<
      FindApprovedTherapistUsecaseCommand,
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

  async execute(command: FindApprovedTherapistUsecaseCommand): Promise<
    {
      therapist: Therapist;
      therapistTypes: TherapistType[];
    }[]
  > {
    return await this.therapistRepository.findApprovedTherapists(
      command.therapyId,
      command.skip,
      command.take,
    );
  }
}
