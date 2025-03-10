import { Inject, Injectable } from '@nestjs/common';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';
import { UseCase } from '../../../usecase.interface';
import { TherapistType } from '../../../../core/domain/entity/therapist-type.entity';

interface CreateTherapistTypeUsecaseCommand {
  therapistId: string;
  therapyCategoryId: string;
}

@Injectable()
export class CreateTherapistTypeUsecase
  implements UseCase<CreateTherapistTypeUsecaseCommand[], TherapistType[]>
{
  constructor(
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(command: CreateTherapistTypeUsecaseCommand[]) {
    return await this.therapistRepository.createTherapyTypes(
      command.map((type) =>
        TherapistType.build({
          therapistId: type.therapistId,
          therapyCategoryId: type.therapyCategoryId,
          enable: false,
        }),
      ),
    );
  }
}
