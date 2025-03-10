import { UseCase } from '../../../usecase.interface';
import { Inject, Injectable } from '@nestjs/common';
import { PremaritalTestRepository } from '../../../../core/domain/repository/pre-marital-test.repository';

@Injectable()
export class CountUserDoneTestsUsecase implements UseCase<string, number> {
  constructor(
    @Inject('PremaritalTestRepository')
    private testRepository: PremaritalTestRepository,
  ) {}

  async execute(userId: string): Promise<number> {
    return this.testRepository.countUserDoneTest(userId);
  }
}
