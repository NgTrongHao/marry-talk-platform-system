import { UseCase } from '../../../usecase.interface';
import { TherapyCategory } from '../../../../core/domain/entity/therapy-category.entity';
import { Inject, Injectable } from '@nestjs/common';
import { TherapyCategoryRepository } from '../../../../core/domain/repository/therapy-category.repository';

@Injectable()
export class GetAllTherapyCategoryUsecase
  implements UseCase<null, TherapyCategory[]>
{
  constructor(
    @Inject('TherapyCategoryRepository')
    private therapyCategoryRepository: TherapyCategoryRepository,
  ) {}

  async execute() {
    return await this.therapyCategoryRepository.findAll();
  }
}
