import { ServicePackage } from '../../../../core/domain/entity/service-package.entity';

export class ServicePackageInfoResponseDto {
  id: string;
  name: string;
  sessions: number;

  constructor(servicePackage: ServicePackage) {
    this.id = servicePackage.id!;
    this.name = servicePackage.name;
    this.sessions = servicePackage.sessionCount;
  }
}
