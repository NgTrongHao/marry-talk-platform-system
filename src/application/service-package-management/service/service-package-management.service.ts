import { Inject, Injectable } from '@nestjs/common';
import { IServicePackageManagementService } from '../service-package-management-service.interface';
import { UsecaseHandler } from '../../usecase-handler.service';
import {
  CreateServicePackageUsecase,
  CreateServicePackageUsecaseCommand,
} from './usecase/create-service-package.usecase';
import { ServicePackageInfoResponseDto } from './dto/service-package-info-response.dto';
import { GetAllServicePackagesUsecase } from './usecase/get-all-service-packages.usecase';
import { UpdateServicePackageUsecase } from './usecase/update-service-package.usecase';
import { TherapistServiceInfoResponseDto } from './dto/therapist-service-info-response.dto';
import { SetTherapistServicesWithTherapyUsecase } from './usecase/set-therapist-services-with-therapy.usecase';
import { ITherapyManagementService } from '../../therapy-management/therapy-management-service.interface';
import { UpdateTherapistServiceUsecase } from './usecase/update-therapist-service.usecase';
import { GetTherapistServicesUsecase } from './usecase/get-therapist-services.usecase';

@Injectable()
export class ServicePackageManagementService
  implements IServicePackageManagementService
{
  constructor(
    private useCaseHandler: UsecaseHandler,
    @Inject('ITherapyManagementService')
    private therapyManagementService: ITherapyManagementService,
  ) {}

  async createServicePackage(
    request: CreateServicePackageUsecaseCommand,
  ): Promise<ServicePackageInfoResponseDto> {
    return await this.useCaseHandler
      .execute(CreateServicePackageUsecase, request)
      .then(
        (servicePackage) => new ServicePackageInfoResponseDto(servicePackage),
      );
  }

  async getAllServicePackages(): Promise<ServicePackageInfoResponseDto[]> {
    return await this.useCaseHandler
      .execute(GetAllServicePackagesUsecase)
      .then((servicePackages) =>
        servicePackages.map(
          (servicePackage) => new ServicePackageInfoResponseDto(servicePackage),
        ),
      );
  }

  async updateServicePackage(
    servicePackageId: string,
    request: {
      name?: string;
      sessions?: number;
    },
  ): Promise<ServicePackageInfoResponseDto> {
    return await this.useCaseHandler
      .execute(UpdateServicePackageUsecase, {
        id: servicePackageId,
        sessionCount: request.sessions,
        ...request,
      })
      .then(
        (servicePackage) => new ServicePackageInfoResponseDto(servicePackage),
      );
  }

  async setTherapistServices(
    userId: string,
    request: {
      therapyId: string;
      therapistServices: {
        price: number;
        servicePackageId: string;
        currency: string;
        description: string;
      }[];
    },
  ): Promise<TherapistServiceInfoResponseDto[]> {
    return await this.useCaseHandler
      .execute(SetTherapistServicesWithTherapyUsecase, {
        therapistId: userId,
        therapyId: request.therapyId,
        therapistServices: request.therapistServices,
      })
      .then(async (therapistServices) => {
        return await Promise.all(
          therapistServices.map(
            async (service) =>
              new TherapistServiceInfoResponseDto(
                service,
                await this.therapyManagementService.getTherapyCategoryById({
                  id: service.therapyCategoryId,
                }),
              ),
          ),
        );
      });
  }

  async updateTherapistService(
    therapistServiceId: string,
    request: {
      price?: number;
      currency?: string;
      description?: string;
    },
  ): Promise<TherapistServiceInfoResponseDto> {
    return this.useCaseHandler
      .execute(UpdateTherapistServiceUsecase, {
        therapistServiceId,
        ...request,
      })
      .then(async (result) => {
        return new TherapistServiceInfoResponseDto(
          result,
          await this.therapyManagementService.getTherapyCategoryById({
            id: result.therapyCategoryId,
          }),
        );
      });
  }

  async getTherapistServices(
    therapistId: string,
    param: {
      therapyId?: string;
      sessions?: number;
      servicePackageId?: string;
    },
  ): Promise<TherapistServiceInfoResponseDto[]> {
    return await this.useCaseHandler
      .execute(GetTherapistServicesUsecase, {
        therapistId,
        ...param,
      })
      .then((therapistServices) => {
        return Promise.all(
          therapistServices.map(async (service) => {
            return new TherapistServiceInfoResponseDto(
              service,
              await this.therapyManagementService.getTherapyCategoryById({
                id: service.therapyCategoryId,
              }),
            );
          }),
        );
      });
  }
}
