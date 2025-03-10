import { Injectable } from '@nestjs/common';
import { PremaritalTestRepository } from '../../../../core/domain/repository/pre-marital-test.repository';
import { PrismaService } from '../prisma.service';
import { PremaritalTest } from '../../../../core/domain/entity/pre-marital-test.entity';
import { PrismaPreMaritalTestMapper } from '../mapper/prisma-pre-marital-test-mapper';
import { TestResult } from '../../../../core/domain/entity/test-result.entity';

@Injectable()
export class PrismaPreMaritalTestRepository
  implements PremaritalTestRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<PremaritalTest | null> {
    const test = await this.prisma.premaritalTest.findUnique({
      where: { test_id: id },
      include: {
        therapyTest: true,
        questions: {
          include: {
            answer: true,
            premaritalTest: true,
          },
        },
      },
    });
    if (!test) {
      return null;
    }
    return PrismaPreMaritalTestMapper.toDomain(test);
  }

  async save(test: PremaritalTest): Promise<PremaritalTest> {
    return this.prisma.premaritalTest
      .upsert({
        where: { test_id: test.id },
        update: {
          test_name: test.name,
          description: test.description,
          updated_at: new Date(),
          therapyTest: {
            deleteMany: {},
            create:
              test.therapyCategories?.map((therapyId) => ({
                therapy_id: therapyId,
              })) || [],
          },
        },
        create: {
          test_id: test.id,
          test_name: test.name,
          description: test.description,
          created_at: new Date(),
          updated_at: new Date(),
          therapyTest: {
            create:
              test.therapyCategories?.map((therapyId) => ({
                therapy_id: therapyId,
              })) || [],
          },
        },
        include: {
          therapyTest: true,
          questions: {
            include: {
              answer: true,
              premaritalTest: true,
            },
          },
        },
      })
      .then((result) => PrismaPreMaritalTestMapper.toDomain(result));
  }

  async getAllTests(
    therapyId: string | undefined,
    skip: number,
    take: number,
  ): Promise<PremaritalTest[]> {
    const tests = await this.prisma.premaritalTest.findMany({
      where: {
        therapyTest: {
          some: {
            therapy_id: therapyId,
          },
        },
      },
      skip,
      take,
      include: {
        therapyTest: true,
        questions: {
          include: {
            answer: true,
            premaritalTest: true,
          },
        },
      },
    });
    return tests.map((test) => PrismaPreMaritalTestMapper.toDomain(test));
  }

  async saveUserTestResponse(testResult: TestResult): Promise<TestResult> {
    const createdTestResult = await this.prisma.testResult.create({
      data: {
        test_id: testResult.testId,
        user_id: testResult.userId,
        user_response: JSON.stringify(testResult.userResponses),
        created_at: new Date(),
        total_score: testResult.score,
      },
      include: {
        test: true,
      },
    });

    return PrismaPreMaritalTestMapper.toTestResult(createdTestResult);
  }

  countUserDoneTest(userId: string): Promise<number> {
    return this.prisma.testResult.count({
      where: { user_id: userId },
    });
  }

  async getUserDoneTests(
    userId: string,
    skip: number,
    take: number,
    therapyId?: string,
  ): Promise<TestResult[]> {
    const tests = await this.prisma.testResult.findMany({
      where: {
        user_id: userId,
        test: {
          therapyTest: {
            some: {
              therapy_id: therapyId,
            },
          },
        },
      },
      skip,
      take,
      include: {
        test: true,
      },
    });

    return tests.map((test) => PrismaPreMaritalTestMapper.toTestResult(test));
  }

  async findTestResultById(testResultId: string): Promise<TestResult | null> {
    return this.prisma.testResult
      .findUnique({
        where: { result_id: testResultId },
        include: { test: true },
      })
      .then((result) =>
        result ? PrismaPreMaritalTestMapper.toTestResult(result) : null,
      );
  }
}
