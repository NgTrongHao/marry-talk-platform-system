import { Injectable } from '@nestjs/common';
import { ITherapyManagementService } from '../therapy-management-service.interface';
import { UsecaseHandler } from '../../usecase-handler.service';
import {
  CreateTherapyCategoryUsecase,
  CreateTherapyCategoryUsecaseCommand,
} from './usecase/create-therapy-category.usecase';
import {
  GetTherapyCategoryByIdUsecase,
  GetTherapyCategoryByIdUsecaseCommand,
} from './usecase/get-therapy-category-by-id.usecase';
import { TherapyInfoResponseDto } from './dto/therapy-info-response.dto';
import { GetAllTherapyCategoryUsecase } from './usecase/get-all-therapy-category.usecase';
import {
  UpdateTherapyCategoryUsecase,
  UpdateTherapyCategoryUsecaseCommand,
} from './usecase/update-therapy-category.usecase';

@Injectable()
export class TherapyManagementService implements ITherapyManagementService {
  constructor(private useCaseHandler: UsecaseHandler) {}

  async createTherapyCategory(request: CreateTherapyCategoryUsecaseCommand) {
    await this.useCaseHandler.execute(CreateTherapyCategoryUsecase, request);
  }

  async getTherapyCategoryById(request: GetTherapyCategoryByIdUsecaseCommand) {
    const therapy = await this.useCaseHandler.execute(
      GetTherapyCategoryByIdUsecase,
      request,
    );
    return new TherapyInfoResponseDto(therapy);
  }

  async getAllTherapyCategories(): Promise<TherapyInfoResponseDto[]> {
    return await this.useCaseHandler
      .execute(GetAllTherapyCategoryUsecase)
      .then((therapies) =>
        therapies.map((therapy) => new TherapyInfoResponseDto(therapy)),
      );
  }

  async updateTherapyCategory(
    request: UpdateTherapyCategoryUsecaseCommand,
  ): Promise<TherapyInfoResponseDto> {
    return await this.useCaseHandler
      .execute(UpdateTherapyCategoryUsecase, request)
      .then((therapy) => new TherapyInfoResponseDto(therapy));
  }
}
