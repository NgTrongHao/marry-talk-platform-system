import { CreateTherapyCategoryUsecaseCommand } from './service/usecase/create-therapy-category.usecase';
import { GetTherapyCategoryByIdUsecaseCommand } from './service/usecase/get-therapy-category-by-id.usecase';
import { TherapyInfoResponseDto } from './service/dto/therapy-info-response.dto';
import { UpdateTherapyCategoryUsecaseCommand } from './service/usecase/update-therapy-category.usecase';

export interface ITherapyManagementService {
  createTherapyCategory(
    request: CreateTherapyCategoryUsecaseCommand,
  ): Promise<void>;

  getTherapyCategoryById(
    request: GetTherapyCategoryByIdUsecaseCommand,
  ): Promise<TherapyInfoResponseDto>;

  getAllTherapyCategories(): Promise<TherapyInfoResponseDto[]>;

  updateTherapyCategory(
    request: UpdateTherapyCategoryUsecaseCommand,
  ): Promise<TherapyInfoResponseDto>;
}
