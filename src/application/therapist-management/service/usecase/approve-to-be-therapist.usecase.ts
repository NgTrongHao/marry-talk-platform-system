import {
  BadRequestException,
  Inject,
  Injectable,
  MethodNotAllowedException,
} from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';

export interface ApproveToBeTherapistUsecaseCommand {
  therapistId: string;
  approve: boolean;
}

@Injectable()
export class ApproveToBeTherapistUsecase
  implements UseCase<ApproveToBeTherapistUsecaseCommand, void>
{
  constructor(
    @Inject('TherapistRepository')
    private therapistRepository: TherapistRepository,
  ) {}

  async execute(command: ApproveToBeTherapistUsecaseCommand): Promise<void> {
    const therapist = await this.therapistRepository.getTherapistProfileById(
      command.therapistId,
    );

    if (!therapist) {
      throw new BadRequestException('Therapist not found');
    }

    if (!command.approve) {
      throw new MethodNotAllowedException(
        'Disapproving therapist-management is not temporarily supported',
      );
    } else {
      await this.therapistRepository.approveTherapistProfile(
        therapist.user.id!,
      );
    }
  }
}
