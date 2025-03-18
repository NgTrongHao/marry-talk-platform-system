import { UseCase } from '../../../usecase.interface';
import { PremaritalTest } from '../../../../core/domain/entity/pre-marital-test.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PremaritalTestRepository } from '../../../../core/domain/repository/pre-marital-test.repository';
import { ITherapyManagementService } from '../../../therapy-management/therapy-management-service.interface';

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
    @Inject('ITherapyManagementService')
    private therapyManagementService: ITherapyManagementService,
  ) {}

  async execute(command: CreateTestUsecaseCommand): Promise<PremaritalTest> {
    for (const therapy of command.therapyCategoryIds) {
      const therapyCategory =
        await this.therapyManagementService.getTherapyCategoryById({
          id: therapy,
        });
      if (!therapyCategory) {
        throw new NotFoundException('Therapy category not found');
      }
    }
    const test = PremaritalTest.create({
      name: command.name,
      description: command.description,
      therapyCategories: command.therapyCategoryIds,
    });

    return this.testRepository.save(test);
  }
}
