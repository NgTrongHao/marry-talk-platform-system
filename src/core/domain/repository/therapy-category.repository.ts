import { TherapyCategory } from '../entity/therapy-category.entity';
import { TherapistType } from '../entity/therapist-type.entity';

export interface TherapyCategoryRepository {
  findById(id: string): Promise<TherapyCategory | null>;

  save(category: TherapyCategory): Promise<TherapyCategory>;

  findAll(): Promise<TherapyCategory[]>;

  findTherapistTypeByTherapistIdAndTherapyCategoryId(
    therapistId: string,
    therapyCategoryId: string,
  ): Promise<TherapistType | null>;

  deleteTherapistTypeByTherapistIdAndTherapyCategoryId(
    therapistId: string,
    categoryId: string,
  ): Promise<void>;

  approveTherapistType(
    therapistId: string,
    therapyCategoryId: string,
  ): Promise<TherapistType>;
}
