import { TherapyCategory } from '../../../../core/domain/entity/therapy-category.entity';
import { Inject } from '@nestjs/common';
import { TherapyCategoryRepository } from '../../../../core/domain/repository/therapy-category.repository';
import { UseCase } from '../../../usecase.interface';

export interface UpdateTherapyCategoryUsecaseCommand {
  id: string;
  name: string;
  description?: string;
  enabled?: boolean;
}

export class UpdateTherapyCategoryUsecase
  implements UseCase<UpdateTherapyCategoryUsecaseCommand, TherapyCategory>
{
  constructor(
    @Inject('TherapyCategoryRepository')
    private therapyCategoryRepository: TherapyCategoryRepository,
  ) {}

  async execute(
    command: UpdateTherapyCategoryUsecaseCommand,
  ): Promise<TherapyCategory> {
    const therapyCategory = await this.therapyCategoryRepository.findById(
      command.id,
    );
    if (!therapyCategory) {
      throw new Error('Therapy category not found');
    }

    therapyCategory.name = command.name;
    if (command.description != null) {
      therapyCategory.description = command.description;
    }

    if (command.enabled != null) {
      therapyCategory.enabled = command.enabled;
    }

    return this.therapyCategoryRepository.save(therapyCategory);
  }
}
