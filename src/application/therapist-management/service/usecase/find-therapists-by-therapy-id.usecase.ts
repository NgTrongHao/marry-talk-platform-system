import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';
import { Therapist } from '../../../../core/domain/entity/therapist.entity';
import { TherapistType } from '../../../../core/domain/entity/therapist-type.entity';

interface FindTherapistsByTherapyIdUsecaseCommand {
  therapyId: string;
  skip: number;
  take: number;
}

@Injectable()
export class FindTherapistsByTherapyIdUsecase
  implements
    UseCase<
      FindTherapistsByTherapyIdUsecaseCommand,
      { therapist: Therapist; therapistTypes: TherapistType[] }[]
    >
{
  constructor(
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(
    command: FindTherapistsByTherapyIdUsecaseCommand,
  ): Promise<{ therapist: Therapist; therapistTypes: TherapistType[] }[]> {
    const results = await this.therapistRepository.findTherapistsByTherapyId(
      command.therapyId,
      command.skip,
      command.take,
    );
    return results.filter((result) => result.therapist.roleEnabled);
  }
}
