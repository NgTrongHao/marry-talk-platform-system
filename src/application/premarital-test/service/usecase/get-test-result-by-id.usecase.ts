import { UseCase } from '../../../usecase.interface';
import { TestResult } from '../../../../core/domain/entity/test-result.entity';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PremaritalTestRepository } from '../../../../core/domain/repository/pre-marital-test.repository';

@Injectable()
export class GetTestResultByIdUsecase implements UseCase<string, TestResult> {
  constructor(
    @Inject('PremaritalTestRepository')
    private testRepository: PremaritalTestRepository,
  ) {}

  async execute(testResultId: string): Promise<TestResult> {
    const testResult =
      await this.testRepository.findTestResultById(testResultId);

    if (!testResult) {
      throw new BadRequestException(
        'Test result with ' + testResultId + ' not found',
      );
    }

    return testResult;
  }
}
