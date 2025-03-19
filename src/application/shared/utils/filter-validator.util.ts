import { BadRequestException } from '@nestjs/common';
import { ProgressStatus } from '../../../core/domain/entity/enum/progress-status.enum';

export function validateFilters(
  status?: string,
  fromDate?: string,
  toDate?: string,
): { parsedFromDate?: Date; parsedToDate?: Date } {
  if (
    status &&
    !Object.values(ProgressStatus).includes(status as ProgressStatus)
  ) {
    throw new BadRequestException({
      statusCode: 400,
      message: `Invalid status value: ${status}. Allowed values: ${Object.values(ProgressStatus).join(', ')}`,
      error: 'Bad Request',
    });
  }

  const parsedFromDate = fromDate ? new Date(fromDate) : undefined;
  const parsedToDate = toDate ? new Date(toDate) : undefined;

  if (parsedFromDate && parsedToDate && parsedFromDate > parsedToDate) {
    throw new BadRequestException({
      statusCode: 400,
      message: 'fromDate must be less than or equal to toDate',
      error: 'Bad Request',
    });
  }

  return { parsedFromDate, parsedToDate };
}
