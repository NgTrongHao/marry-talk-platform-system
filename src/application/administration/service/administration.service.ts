import { Injectable } from '@nestjs/common';
import { IAdministrationService } from '../administration-service.interface';
import { UsecaseHandler } from '../../usecase-handler.service';
import { GetFinancialReportUsecase } from './usecase/get-financial-report.usecase';
import { GetTotalUsersUsecase } from './usecase/get-total-users.usecase';
import { Role } from '../../../core/domain/entity/enum/role.enum';

@Injectable()
export class AdministrationService implements IAdministrationService {
  constructor(private usecaseHandler: UsecaseHandler) {}

  getFinancialReport(
    fromDate: Date | undefined,
    toDate: Date | undefined,
  ): Promise<{
    revenue: number;
    expense: number;
    profit: number;
  }> {
    return this.usecaseHandler.execute(GetFinancialReportUsecase, {
      fromDate,
      toDate,
    });
  }

  getTotalUsers(
    fromDate: Date | undefined,
    toDate: Date | undefined,
    role: Role | undefined,
  ): Promise<number> {
    return this.usecaseHandler.execute(GetTotalUsersUsecase, {
      fromDate,
      toDate,
      role,
    });
  }
}
