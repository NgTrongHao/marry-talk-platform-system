import { PremaritalTest } from '../entity/pre-marital-test.entity';
import { TestResult } from '../entity/test-result.entity';

export interface PremaritalTestRepository {
  save(test: PremaritalTest): Promise<PremaritalTest>;

  findById(id: string): Promise<PremaritalTest | null>;

  getAllTests(
    therapyId: string | undefined,
    skip: number,
    take: number,
  ): Promise<PremaritalTest[]>;

  saveUserTestResponse(testResult: TestResult): Promise<TestResult>;

  countUserDoneTest(userId: string): Promise<number>;

  getUserDoneTests(
    userId: string,
    skip: number,
    take: number,
    therapyId?: string,
  ): Promise<TestResult[]>;

  findTestResultById(testResultId: string): Promise<TestResult | null>;
}
