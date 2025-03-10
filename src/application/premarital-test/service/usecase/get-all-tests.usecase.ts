import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { PremaritalTestRepository } from '../../../../core/domain/repository/pre-marital-test.repository';
import { PremaritalTest } from '../../../../core/domain/entity/pre-marital-test.entity';

export interface GetAllTestUsecaseCommand {
  therapyId?: string;
  skip: number;
  take: number;
}

@Injectable()
export class GetAllTestsUsecase
  implements UseCase<GetAllTestUsecaseCommand, PremaritalTest[]>
{
  constructor(
    @Inject('PremaritalTestRepository')
    private testRepository: PremaritalTestRepository,
  ) {}

  execute(command: GetAllTestUsecaseCommand): Promise<PremaritalTest[]> {
    return this.testRepository.getAllTests(
      command.therapyId,
      command.skip,
      command.take,
    );
  }
}
