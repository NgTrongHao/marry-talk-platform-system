import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '../../../usecase.interface';
import { PremaritalTest } from '../../../../core/domain/entity/pre-marital-test.entity';
import { PremaritalTestRepository } from '../../../../core/domain/repository/pre-marital-test.repository';
import { ITherapyManagementService } from '../../../therapy-management/therapy-management-service.interface';

interface UpdateTestUsecaseCommand {
  testId: string;
  name?: string;
  description?: string;
  therapyCategoryIds?: string[];
}

@Injectable()
export class UpdateTestUsecase
  implements UseCase<UpdateTestUsecaseCommand, PremaritalTest>
{
  constructor(
    @Inject('PremaritalTestRepository')
    private testRepository: PremaritalTestRepository,
    @Inject('ITherapyManagementService')
    private therapyManagementService: ITherapyManagementService,
  ) {}

  async execute(command: UpdateTestUsecaseCommand): Promise<PremaritalTest> {
    const test = await this.testRepository.findById(command.testId);

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    if (command.name) {
      test.name = command.name;
    }

    if (command.description) {
      test.description = command.description;
    }

    if (command.therapyCategoryIds) {
      for (const therapy of command.therapyCategoryIds) {
        const therapyCategory =
          await this.therapyManagementService.getTherapyCategoryById({
            id: therapy,
          });
        if (!therapyCategory) {
          throw new NotFoundException('Therapy category not found');
        }
      }

      test.therapyCategories = command.therapyCategoryIds;
    }

    return await this.testRepository.save(test);
  }
}
