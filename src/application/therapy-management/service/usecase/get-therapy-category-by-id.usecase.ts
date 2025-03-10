import { UseCase } from '../../../usecase.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TherapyCategoryRepository } from '../../../../core/domain/repository/therapy-category.repository';
import { TherapyCategory } from '../../../../core/domain/entity/therapy-category.entity';

export interface GetTherapyCategoryByIdUsecaseCommand {
  id: string;
}

@Injectable()
export class GetTherapyCategoryByIdUsecase
  implements UseCase<GetTherapyCategoryByIdUsecaseCommand, TherapyCategory>
{
  constructor(
    @Inject('TherapyCategoryRepository')
    private therapyCategoryRepository: TherapyCategoryRepository,
  ) {}

  async execute(command: GetTherapyCategoryByIdUsecaseCommand) {
    const therapy = await this.therapyCategoryRepository.findById(command.id);
    return therapy != null
      ? therapy
      : (() => {
          throw new NotFoundException(
            'Therapy category not found by id ' + command.id,
          );
        })();
  }
}
