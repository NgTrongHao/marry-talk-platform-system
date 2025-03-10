import { TherapistInfoResponseDto } from '../user/service/dto/therapist-info-response.dto';
import { WorkingHoursInfoDto } from './service/dto/working-hours-info.dto';
import { DayOfWeek } from '../../core/domain/entity/enum/day-of-week.enum';

export interface ITherapistManagementService {
  approveTherapyCategory(param: {
    therapistId: string;
    categoryId: string;
    approve: boolean;
  }): Promise<void>;

  approveTherapist(param: {
    therapistId: string;
    approve: boolean;
  }): Promise<void>;

  findTherapistWithTherapies(param: {
    therapyCategoryId: string;
    page: number;
    limit: number;
  }): Promise<{
    therapists: TherapistInfoResponseDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>;

  putTherapistWorkingHours(
    therapistId: string,
    workSchedule: {
      dayOfWeek: DayOfWeek;
      startTime: string;
      endTime: string;
    }[],
  ): Promise<WorkingHoursInfoDto[]>;

  getTherapistWorkingHours(therapistId: string): Promise<WorkingHoursInfoDto[]>;

  getAllApprovedTherapists(request: {
    page: number;
    limit: number;
    therapyId?: string;
  }): Promise<{
    therapists: TherapistInfoResponseDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>;

  getUnapprovedTherapists(param: {
    page: number;
    limit: number;
    therapyId: string | undefined;
  }): Promise<{
    therapists: TherapistInfoResponseDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }>;
}
