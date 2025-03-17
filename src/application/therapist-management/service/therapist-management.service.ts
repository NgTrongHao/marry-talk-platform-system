import { ITherapistManagementService } from '../therapist-management-service.interface';
import { Inject, Injectable } from '@nestjs/common';
import { UsecaseHandler } from '../../usecase-handler.service';
import {
  ApproveTherapistTypeUsecase,
  ApproveTherapistTypeUsecaseCommand,
} from './usecase/approve-therapist-type.usecase';
import {
  ApproveToBeTherapistUsecase,
  ApproveToBeTherapistUsecaseCommand,
} from './usecase/approve-to-be-therapist.usecase';
import { TherapistInfoResponseDto } from '../../user/service/dto/therapist-info-response.dto';
import { FindTherapistsByTherapyIdUsecase } from './usecase/find-therapists-by-therapy-id.usecase';
import { CountTherapistHasTherapyIdUsecase } from './usecase/count-therapist-has-therapy-id.usecase';
import { Therapist } from '../../../core/domain/entity/therapist.entity';
import { TherapistType } from '../../../core/domain/entity/therapist-type.entity';
import { TherapistTypeInfoResponseDto } from '../../user/service/dto/therapist-type-info-response.dto';
import { ITherapyManagementService } from '../../therapy-management/therapy-management-service.interface';
import { PutTherapistWorkScheduleUsecase } from './usecase/put-therapist-work-schedule.usecase';
import { WorkingHoursInfoDto } from './dto/working-hours-info.dto';
import { DayOfWeek } from '../../../core/domain/entity/enum/day-of-week.enum';
import { GetTherapistWorkScheduleUsecase } from './usecase/get-therapist-work-schedule.usecase';
import { FindApprovedTherapistUsecase } from './usecase/find-approved-therapist.usecase';
import { CountApprovedTherapistUsecase } from './usecase/count-approved-therapist.usecase';
import { FindUnapprovedTherapistUsecase } from './usecase/find-unapproved-therapist.usecase';
import { CountUnapprovedTherapistUsecase } from './usecase/count-unapproved-therapist.usecase';
import { TherapistBalanceInfoDto } from './dto/therapist-balance-info.dto';
import { GetTherapistBalanceUsecase } from './usecase/get-therapist-balance.usecase';

@Injectable()
export class TherapistManagementService implements ITherapistManagementService {
  constructor(
    private usecaseHandler: UsecaseHandler,
    @Inject('ITherapyManagementService')
    private therapyManagementService: ITherapyManagementService,
  ) {}

  async approveTherapyCategory(
    request: ApproveTherapistTypeUsecaseCommand,
  ): Promise<void> {
    return await this.usecaseHandler.execute(
      ApproveTherapistTypeUsecase,
      request,
    );
  }

  approveTherapist(request: ApproveToBeTherapistUsecaseCommand): Promise<void> {
    return this.usecaseHandler.execute(ApproveToBeTherapistUsecase, request);
  }

  async findTherapistWithTherapies(param: {
    therapyCategoryId: string;
    page: number;
    limit: number;
    sessionDate?: Date;
    startTime?: string;
    endTime?: string;
  }): Promise<{
    therapists: TherapistInfoResponseDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }> {
    const skip = (param.page - 1) * param.limit;
    const take = Number(param.limit);
    const [therapists, total] = await Promise.all([
      this.usecaseHandler.execute(FindTherapistsByTherapyIdUsecase, {
        therapyId: param.therapyCategoryId,
        skip,
        take,
        sessionDate: param.sessionDate,
        startTime: param.startTime,
        endTime: param.endTime,
      }),
      this.usecaseHandler.execute(
        CountTherapistHasTherapyIdUsecase,
        param.therapyCategoryId,
      ),
    ]);
    const totalPages = Math.ceil(total / param.limit);
    return {
      therapists: await this.mapTherapistsWithTypes(therapists),
      page: param.page,
      limit: param.limit,
      total,
      totalPages,
    };
  }

  async putTherapistWorkingHours(
    therapistId: string,
    workSchedule: {
      dayOfWeek: DayOfWeek;
      startTime: string;
      endTime: string;
    }[],
  ): Promise<WorkingHoursInfoDto[]> {
    return await this.usecaseHandler
      .execute(PutTherapistWorkScheduleUsecase, { therapistId, workSchedule })
      .then((workingHours) => {
        return workingHours.map((workingHour) => {
          return WorkingHoursInfoDto.fromEntity(workingHour);
        });
      });
  }

  getTherapistWorkingHours(
    therapistId: string,
  ): Promise<WorkingHoursInfoDto[]> {
    return this.usecaseHandler.execute(
      GetTherapistWorkScheduleUsecase,
      therapistId,
    );
  }

  async getAllApprovedTherapists(request: {
    page: number;
    limit: number;
    therapyId?: string;
  }): Promise<{
    therapists: TherapistInfoResponseDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }> {
    const skip = (request.page - 1) * request.limit;
    const take = Number(request.limit);

    const [therapists, total] = await Promise.all([
      this.usecaseHandler.execute(FindApprovedTherapistUsecase, {
        therapyId: request.therapyId,
        skip,
        take,
      }),
      this.usecaseHandler.execute(
        CountApprovedTherapistUsecase,
        request.therapyId,
      ),
    ]);
    const totalPages = Math.ceil(total / request.limit);

    return {
      therapists: await this.mapTherapistsWithTypes(therapists),
      page: request.page,
      limit: request.limit,
      total,
      totalPages,
    };
  }

  async getUnapprovedTherapists(request: {
    page: number;
    limit: number;
    therapyId: string | undefined;
  }): Promise<{
    therapists: TherapistInfoResponseDto[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }> {
    const skip = (request.page - 1) * request.limit;
    const take = Number(request.limit);

    const [therapists, total] = await Promise.all([
      this.usecaseHandler.execute(FindUnapprovedTherapistUsecase, {
        therapyId: request.therapyId,
        skip,
        take,
      }),
      this.usecaseHandler.execute(
        CountUnapprovedTherapistUsecase,
        request.therapyId,
      ),
    ]);
    const totalPages = Math.ceil(total / request.limit);

    return {
      therapists: await this.mapTherapistsWithTypes(therapists),
      page: request.page,
      limit: request.limit,
      total,
      totalPages,
    };
  }

  private async mapTherapistsWithTypes(
    therapists: {
      therapist: Therapist;
      therapistTypes: TherapistType[];
    }[],
  ): Promise<TherapistInfoResponseDto[]> {
    return await Promise.all(
      therapists.map(async (therapist) => {
        const therapistTypes = await Promise.all(
          therapist.therapistTypes.map(async (type) => {
            const therapy =
              await this.therapyManagementService.getTherapyCategoryById({
                id: type.therapyCategoryId,
              });
            return new TherapistTypeInfoResponseDto(therapy, type.enable);
          }),
        );
        return new TherapistInfoResponseDto(
          therapist.therapist,
          therapistTypes,
        );
      }),
    );
  }

  async getTherapistBalance(
    therapistId: string,
  ): Promise<TherapistBalanceInfoDto> {
    return this.usecaseHandler
      .execute(GetTherapistBalanceUsecase, therapistId)
      .then((balance) => {
        return new TherapistBalanceInfoDto(balance);
      });
  }
}
