import { Entity } from '../../base/entity';

interface ServicePackageProps {
  id?: string;
  name: string;
  sessionCount: number;
}

export class ServicePackage extends Entity<ServicePackageProps> {
  private constructor(props: ServicePackageProps) {
    super(props);
  }

  public static build(props: ServicePackageProps): ServicePackage {
    return new ServicePackage(props);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get sessionCount(): number {
    return this.props.sessionCount;
  }
}
