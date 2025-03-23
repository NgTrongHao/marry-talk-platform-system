import { Role } from '../../core/domain/entity/enum/role.enum';

export interface IAdministrationService {
  getFinancialReport(
    fromDate: Date | undefined,
    toDate: Date | undefined,
  ): Promise<{
    revenue: number;
    expense: number;
    profit: number;
  }>;

  getTotalUsers(
    fromDate: Date | undefined,
    toDate: Date | undefined,
    role: Role | undefined,
  ): Promise<number>;
}
