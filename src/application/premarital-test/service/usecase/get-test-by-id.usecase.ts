import { UseCase } from '../../../usecase.interface';
import { PremaritalTest } from '../../../../core/domain/entity/pre-marital-test.entity';
import { Inject, Injectable } from '@nestjs/common';
import { PremaritalTestRepository } from '../../../../core/domain/repository/pre-marital-test.repository';

@Injectable()
export class GetTestByIdUsecase
  implements UseCase<string, PremaritalTest | null>
{
  constructor(
    @Inject('PremaritalTestRepository')
    private testRepository: PremaritalTestRepository,
  ) {}

  async execute(testId: string): Promise<PremaritalTest | null> {
    return this.testRepository.findById(testId);
  }
}
