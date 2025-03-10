import { UseCase } from '../../../usecase.interface';
import { Inject, Injectable } from '@nestjs/common';
import { PremaritalTestRepository } from '../../../../core/domain/repository/pre-marital-test.repository';
import { TestResult } from '../../../../core/domain/entity/test-result.entity';

export interface GetUserDoneTestsUsecaseCommand {
  userId: string;
  skip: number;
  take: number;
  therapyId?: string;
}

@Injectable()
export class GetUserDoneTestsUsecase
  implements UseCase<GetUserDoneTestsUsecaseCommand, TestResult[]>
{
  constructor(
    @Inject('PremaritalTestRepository')
    private testRepository: PremaritalTestRepository,
  ) {}

  async execute(
    command: GetUserDoneTestsUsecaseCommand,
  ): Promise<TestResult[]> {
    return this.testRepository.getUserDoneTests(
      command.userId,
      command.skip,
      command.take,
      command.therapyId,
    );
  }
}
