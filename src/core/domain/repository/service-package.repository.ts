import { ServicePackage } from '../entity/service-package.entity';
import { TherapistService } from '../entity/therapist-service.entity';

export interface ServicePackageRepository {
  save(servicePackage: ServicePackage): Promise<ServicePackage>;

  getAll(): Promise<ServicePackage[]>;

  findById(id: string): Promise<ServicePackage | null>;

  saveTherapistService(service: TherapistService): Promise<TherapistService>;

  checkExistServicePackage(command: {
    name?: string;
    sessions?: number;
    excludeId?: string;
  }): Promise<boolean>;

  findTherapistServiceById(
    therapistServiceId: string,
  ): Promise<TherapistService | null>;

  getTherapistServices(command: {
    therapistId: string;
    therapyId?: string;
    sessions?: number;
    servicePackageId?: string;
  }): Promise<TherapistService[]>;

  // getTherapistServiceById(
  //   therapistServiceId: string,
  // ): Promise<TherapistService | null>;
}
