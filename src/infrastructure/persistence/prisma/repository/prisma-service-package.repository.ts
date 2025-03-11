import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ServicePackageRepository } from '../../../../core/domain/repository/service-package.repository';
import { ServicePackage } from '../../../../core/domain/entity/service-package.entity';
import { PrismaServicePackageMapper } from '../mapper/prisma-service-package-mapper';
import { TherapistService } from '../../../../core/domain/entity/therapist-service.entity';

@Injectable()
export class PrismaServicePackageRepository
  implements ServicePackageRepository
{
  constructor(private prisma: PrismaService) {}

  async save(servicePackage: ServicePackage): Promise<ServicePackage> {
    return this.prisma.servicePackage
      .upsert({
        where: { package_id: servicePackage.id },
        update: {
          title: servicePackage.name,
          sessions: servicePackage.sessionCount,
        },
        create: {
          package_id: servicePackage.id,
          title: servicePackage.name,
          sessions: servicePackage.sessionCount,
        },
      })
      .then((result) => PrismaServicePackageMapper.toDomain(result));
  }

  async getAll(): Promise<ServicePackage[]> {
    const result = await this.prisma.servicePackage.findMany();
    return result.map((item) => PrismaServicePackageMapper.toDomain(item));
  }

  async findById(id: string): Promise<ServicePackage | null> {
    const result = await this.prisma.servicePackage.findUnique({
      where: { package_id: id },
    });
    if (result) {
      return PrismaServicePackageMapper.toDomain(result);
    }
    return null;
  }

  async saveTherapistService(
    service: TherapistService,
  ): Promise<TherapistService> {
    return this.prisma.therapistService
      .upsert({
        where: {
          therapist_service_id: service.id!,
        },
        update: {
          price: service.price,
          currency: service.currency,
          description: service.description,
          package_id: service.package.id!,
        },
        create: {
          therapist_service_id: service.id,
          price: service.price,
          currency: service.currency,
          description: service.description,
          therapist_id: service.therapistId,
          therapy_id: service.therapyCategoryId,
          package_id: service.package.id!,
        },
        include: {
          package: true,
        },
      })
      .then((result) =>
        PrismaServicePackageMapper.toTherapistServiceDomain(result),
      );
  }

  async checkExistServicePackage(command: {
    name?: string;
    sessions?: number;
    excludeId?: string;
  }): Promise<boolean> {
    const conditions: { title?: string; sessions?: number }[] = [];

    if (command.name) {
      conditions.push({ title: command.name });
    }

    if (command.sessions) {
      conditions.push({ sessions: command.sessions });
    }

    if (conditions.length === 0) {
      return false;
    }

    return this.prisma.servicePackage
      .findFirst({
        where: {
          OR: conditions,
          NOT: command.excludeId
            ? { package_id: command.excludeId }
            : undefined,
        },
      })
      .then((result) => !!result);
  }

  async findTherapistServiceById(
    therapistServiceId: string,
  ): Promise<TherapistService | null> {
    return this.prisma.therapistService
      .findUnique({
        where: {
          therapist_service_id: therapistServiceId,
        },
        include: {
          package: true,
        },
      })
      .then((result) => {
        if (result) {
          return PrismaServicePackageMapper.toTherapistServiceDomain(result);
        }
        return null;
      });
  }

  async getTherapistServices(command: {
    therapistId: string;
    therapyId?: string;
    sessions?: number;
    servicePackageId?: string;
  }): Promise<TherapistService[]> {
    const serviceConditions: Array<{ package_id?: string; sessions?: number }> =
      [];

    if (command.servicePackageId) {
      serviceConditions.push({ package_id: command.servicePackageId });
    }
    if (command.sessions) {
      serviceConditions.push({ sessions: command.sessions });
    }

    return this.prisma.therapistService
      .findMany({
        where: {
          therapist_id: command.therapistId,
          ...(command.therapyId && { therapy_id: command.therapyId }),
          ...(serviceConditions.length > 0
            ? { package: { OR: serviceConditions } }
            : {}),
        },
        include: {
          package: true,
        },
      })
      .then((result) =>
        result.map((item) =>
          PrismaServicePackageMapper.toTherapistServiceDomain(item),
        ),
      );
  }
}
