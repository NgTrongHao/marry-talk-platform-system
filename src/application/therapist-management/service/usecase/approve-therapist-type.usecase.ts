import { UseCase } from '../../../usecase.interface';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TherapyCategoryRepository } from '../../../../core/domain/repository/therapy-category.repository';

export interface ApproveTherapistTypeUsecaseCommand {
  therapistId: string;
  categoryId: string;
  approve: boolean;
}

@Injectable()
export class ApproveTherapistTypeUsecase
  implements UseCase<ApproveTherapistTypeUsecaseCommand, void>
{
  constructor(
    @Inject('TherapyCategoryRepository')
    private therapyCategoryRepository: TherapyCategoryRepository,
  ) {}

  async execute(command: ApproveTherapistTypeUsecaseCommand): Promise<void> {
    const therapistType =
      await this.therapyCategoryRepository.findTherapistTypeByTherapistIdAndTherapyCategoryId(
        command.therapistId,
        command.categoryId,
      );

    if (!therapistType) {
      throw new BadRequestException('Therapist type not found');
    }

    if (!command.approve) {
      await this.therapyCategoryRepository.deleteTherapistTypeByTherapistIdAndTherapyCategoryId(
        therapistType.therapistId,
        therapistType.therapyCategoryId,
      );
    } else {
      await this.therapyCategoryRepository.approveTherapistType(
        therapistType.therapistId,
        therapistType.therapyCategoryId,
      );
    }
  }
}
