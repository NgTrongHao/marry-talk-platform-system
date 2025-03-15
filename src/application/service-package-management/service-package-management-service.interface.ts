import { ServicePackageInfoResponseDto } from './service/dto/service-package-info-response.dto';
import { TherapistServiceInfoResponseDto } from './service/dto/therapist-service-info-response.dto';

export interface IServicePackageManagementService {
  createServicePackage(request: {
    name: string;
    sessions: number;
  }): Promise<ServicePackageInfoResponseDto>;

  getAllServicePackages(): Promise<ServicePackageInfoResponseDto[]>;

  updateServicePackage(
    servicePackageId: string,
    request: {
      name?: string;
      sessions?: number;
    },
  ): Promise<ServicePackageInfoResponseDto>;

  setTherapistServices(
    userId: string,
    request: {
      therapyId: string;
      therapistServices: {
        price: number;
        servicePackageId: string;
        currency: string;
        timeInMinutes: number;
        description: string;
      }[];
    },
  ): Promise<TherapistServiceInfoResponseDto[]>;

  updateTherapistService(
    therapistServiceId: string,
    request: {
      price?: number;
      currency?: string;
      timeInMinutes?: number;
      description?: string;
    },
  ): Promise<TherapistServiceInfoResponseDto>;

  getTherapistServices(
    therapistId: string,
    param: {
      therapyId?: string;
      sessions?: number;
      servicePackageId?: string;
    },
  ): Promise<TherapistServiceInfoResponseDto[]>;

  getTherapistServiceById(
    therapistServiceId: string,
  ): Promise<TherapistServiceInfoResponseDto>;
}
