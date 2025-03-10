import { Injectable } from '@nestjs/common';
import { TherapyCategoryRepository } from '../../../../core/domain/repository/therapy-category.repository';
import { TherapyCategory } from '../../../../core/domain/entity/therapy-category.entity';
import { PrismaService } from '../prisma.service';
import { PrismaTherapyMapper } from '../mapper/prisma-therapy-mapper';
import { TherapistType } from '../../../../core/domain/entity/therapist-type.entity';

@Injectable()
export class PrismaTherapyCategoryRepository
  implements TherapyCategoryRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<TherapyCategory | null> {
    const therapy = await this.prisma.therapy.findUnique({
      where: { therapy_id: id },
    });
    return therapy ? PrismaTherapyMapper.toDomain(therapy) : null;
  }

  async save(category: TherapyCategory): Promise<TherapyCategory> {
    const data = PrismaTherapyMapper.toPersistence(category);
    const therapy = await this.prisma.therapy.upsert({
      where: { therapy_id: category.id },
      create: data,
      update: data,
    });
    return PrismaTherapyMapper.toDomain(therapy);
  }

  async findAll(): Promise<TherapyCategory[]> {
    return await this.prisma.therapy
      .findMany()
      .then((therapies) =>
        therapies.map((therapy) => PrismaTherapyMapper.toDomain(therapy)),
      );
  }

  async findTherapistTypeByTherapistIdAndTherapyCategoryId(
    therapistId: string,
    therapyCategoryId: string,
  ): Promise<TherapistType | null> {
    return this.prisma.therapistType
      .findUnique({
        where: {
          therapist_id_therapy_id: {
            therapy_id: therapyCategoryId,
            therapist_id: therapistId,
          },
        },
      })
      .then((type) => {
        if (!type) {
          return null;
        }
        return TherapistType.build({
          therapistId: type.therapist_id,
          therapyCategoryId: type.therapy_id,
          enable: type.enabled,
        });
      });
  }

  approveTherapistType(
    therapistId: string,
    therapyCategoryId: string,
  ): Promise<TherapistType> {
    return this.prisma.therapistType
      .update({
        where: {
          therapist_id_therapy_id: {
            therapy_id: therapyCategoryId,
            therapist_id: therapistId,
          },
        },
        data: {
          enabled: true,
        },
      })
      .then((type) =>
        TherapistType.build({
          therapistId: type.therapist_id,
          therapyCategoryId: type.therapy_id,
          enable: type.enabled,
        }),
      );
  }

  async deleteTherapistTypeByTherapistIdAndTherapyCategoryId(
    therapistId: string,
    categoryId: string,
  ): Promise<void> {
    await this.prisma.therapistType.delete({
      where: {
        therapist_id_therapy_id: {
          therapy_id: categoryId,
          therapist_id: therapistId,
        },
      },
    });
  }
}
