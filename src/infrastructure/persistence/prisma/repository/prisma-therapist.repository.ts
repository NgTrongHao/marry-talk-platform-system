import { Therapist } from '../../../../core/domain/entity/therapist.entity';
import { PrismaTherapistMapper } from '../mapper/prisma-therapist-mapper';
import { Injectable } from '@nestjs/common';
import { TherapistRepository } from '../../../../core/domain/repository/therapist.repository';
import { PrismaService } from '../prisma.service';
import { TherapistType } from '../../../../core/domain/entity/therapist-type.entity';
import { WorkingHours } from '../../../../core/domain/entity/working-hours.entity';
import {
  dayOfWeekToNumber,
  numberToDayOfWeek,
} from '../../../../core/domain/entity/enum/day-of-week.enum';

@Injectable()
export class PrismaTherapistRepository implements TherapistRepository {
  constructor(private prisma: PrismaService) {}

  async createTherapistProfile(therapist: Therapist): Promise<Therapist> {
    const savedUser = await this.prisma.user.update({
      where: { user_id: therapist.user.id },
      data: {
        phone_number: therapist.phoneNumber ?? null,
        avatar_image: therapist.avatarImageURL ?? null,
        birth_date: therapist.birthdate ?? null,
        expert_certificate: therapist.expertCertificates,
        professional_experience: therapist.professionalExperience ?? null,
        bio: therapist.bio ?? null,
        role_enabled: therapist.roleEnabled,
      },
      include: { therapistType: true },
    });

    return PrismaTherapistMapper.toDomain(savedUser);
  }

  async getTherapistProfileByUsername(
    username: string,
  ): Promise<Therapist | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: { therapistType: true },
    });

    // user and therapist-management type
    return user ? PrismaTherapistMapper.toDomain(user) : null;
  }

  async createTherapyTypes(types: TherapistType[]): Promise<TherapistType[]> {
    const therapistTypes = await this.prisma.$transaction(
      types.map((type) =>
        this.prisma.therapistType.create({
          data: {
            therapy_id: type.therapyCategoryId,
            therapist_id: type.therapistId,
          },
        }),
      ),
    );

    return therapistTypes.map((type) =>
      TherapistType.build({
        therapistId: type.therapist_id,
        therapyCategoryId: type.therapy_id,
        enable: type.enabled,
      }),
    );
  }

  async findTherapistsByTherapyId(
    therapyId: string,
    skip: number,
    take: number,
  ): Promise<{ therapist: Therapist; therapistTypes: TherapistType[] }[]> {
    const therapists = await this.prisma.user.findMany({
      where: {
        role: 'THERAPIST',
        therapistType: {
          some: {
            therapy_id: therapyId,
          },
        },
      },
      skip,
      take,
      include: { therapistType: true },
    });

    return therapists.map((therapist) => ({
      therapist: PrismaTherapistMapper.toDomain(therapist),
      therapistTypes: therapist.therapistType.map((type) =>
        TherapistType.build({
          therapistId: type.therapist_id,
          therapyCategoryId: type.therapy_id,
          enable: type.enabled,
        }),
      ),
    }));
  }

  async getTherapistProfileById(
    therapistId: string,
  ): Promise<Therapist | null> {
    const therapist = await this.prisma.user.findUnique({
      where: { user_id: therapistId },
      include: { therapistType: true },
    });
    return therapist ? PrismaTherapistMapper.toDomain(therapist) : null;
  }

  async approveTherapistProfile(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { user_id: id },
      data: { role_enabled: true },
    });
  }

  countTherapistHasTherapyId(therapyId: string): Promise<number> {
    return this.prisma.therapistType.count({
      where: { therapy_id: therapyId },
    });
  }

  async putTherapistWorkSchedule(
    therapistId: string,
    workSchedule: WorkingHours[],
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.workingSchedule.deleteMany({ where: { therapistId } });

      await tx.workingSchedule.create({
        data: {
          therapistId,
          schedules: {
            create: workSchedule.map((wh) => ({
              dayOfWeek: dayOfWeekToNumber[wh.dayOfWeek],
              startTime: wh.startTime,
              endTime: wh.endTime,
            })),
          },
        },
      });
    });
  }

  async getTherapistWorkSchedule(therapistId: string): Promise<WorkingHours[]> {
    const schedule = await this.prisma.workingSchedule.findFirst({
      where: { therapistId },
      include: { schedules: true },
    });

    if (!schedule) return [];

    return schedule.schedules.map((workTime) =>
      WorkingHours.build({
        dayOfWeek: numberToDayOfWeek[workTime.dayOfWeek],
        startTime: workTime.startTime,
        endTime: workTime.endTime,
      }),
    );
  }
}
