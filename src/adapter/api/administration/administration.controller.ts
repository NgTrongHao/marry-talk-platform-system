import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IAdministrationService } from '../../../application/administration/administration-service.interface';
import { validateFilters } from '../../../application/shared/utils/filter-validator.util';
import { Role } from '../../../core/domain/entity/enum/role.enum';

@Controller('administration')
@ApiTags('Administration')
export class AdministrationController {
  constructor(
    @Inject('IAdministrationService')
    private readonly administrationService: IAdministrationService,
  ) {}

  @Get('financial-report')
  @ApiOperation({
    summary: 'Get financial report REST API',
    description:
      'Get financial report (revenue, expense, profit) REST API (default: current month)',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    description: 'Start date of the financial report (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    description: 'End date of the financial report (YYYY-MM-DD)',
  })
  async getFinancialReport(
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    const { parsedFromDate, parsedToDate } = validateFilters(
      undefined,
      from,
      to,
    );
    return await this.administrationService.getFinancialReport(
      parsedFromDate,
      parsedToDate,
    );
  }

  @Get('total-users')
  @ApiOperation({
    summary: 'Get total users REST API',
    description: 'Get total users REST API (default: all time)',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    description: 'Start date of the financial report (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    description: 'End date of the financial report (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'role',
    required: false,
  })
  async getTotalUsers(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('role') role: Role,
  ) {
    if (role && !Object.values(Role).includes(role)) {
      throw new BadRequestException({
        statusCode: 400,
        message: `Invalid role value: ${role}. Allowed values: ${Object.values(Role).join(', ')}`,
        error: 'Bad Request',
      });
    }
    const { parsedFromDate, parsedToDate } = validateFilters(
      undefined,
      from,
      to,
    );
    return await this.administrationService.getTotalUsers(
      parsedFromDate,
      parsedToDate,
      role,
    );
  }
}
