import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { TherapyCategoryRepository } from '../../../../core/domain/repository/therapy-category.repository';
import { TherapyCategory } from '../../../../core/domain/entity/therapy-category.entity';

export interface CreateTherapyCategoryUsecaseCommand {
  name: string;
  description: string;
}

@Injectable()
export class CreateTherapyCategoryUsecase
  implements UseCase<CreateTherapyCategoryUsecaseCommand, TherapyCategory>
{
  constructor(
    @Inject('TherapyCategoryRepository')
    private therapyCategoryRepository: TherapyCategoryRepository,
  ) {}

  async execute(
    command: CreateTherapyCategoryUsecaseCommand,
  ): Promise<TherapyCategory> {
    return await this.therapyCategoryRepository.save(
      TherapyCategory.create({
        name: command.name,
        description: command.description,
      }),
    );
  }
}
