import { TherapyCategory } from '../../../../core/domain/entity/therapy-category.entity';
import { Prisma, Therapy } from '@prisma/client';

export class PrismaTherapyMapper {
  static toDomain(entity: Therapy): TherapyCategory {
    return TherapyCategory.build({
      id: entity.therapy_id,
      name: entity.title,
      description: entity.description,
      enabled: entity.enabled,
    });
  }

  static toPersistence(
    domain: TherapyCategory,
  ): Prisma.TherapyUncheckedCreateInput {
    return {
      title: domain.name,
      description: domain.description,
      enabled: domain.enabled,
    };
  }
}
