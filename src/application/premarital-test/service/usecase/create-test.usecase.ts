import { UseCase } from '../../../usecase.interface';
import { PremaritalTest } from '../../../../core/domain/entity/pre-marital-test.entity';
import { Inject, Injectable } from '@nestjs/common';
import { PremaritalTestRepository } from '../../../../core/domain/repository/pre-marital-test.repository';

export interface CreateTestUsecaseCommand {
  name: string;
  description: string;
  therapyCategoryIds: string[];
}

@Injectable()
export class CreateTestUsecase
  implements UseCase<CreateTestUsecaseCommand, PremaritalTest>
{
  constructor(
    @Inject('PremaritalTestRepository')
    private testRepository: PremaritalTestRepository,
  ) {}

  async execute(command: CreateTestUsecaseCommand): Promise<PremaritalTest> {
    const test = PremaritalTest.create({
      name: command.name,
      description: command.description,
      therapyCategories: command.therapyCategoryIds,
    });

    return this.testRepository.save(test);
  }
}
