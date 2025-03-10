import { Therapist } from '../entity/therapist.entity';
import { TherapistType } from '../entity/therapist-type.entity';
import { WorkingHours } from '../entity/working-hours.entity';

export interface TherapistRepository {
  createTherapistProfile(therapist: Therapist): Promise<Therapist>;

  getTherapistProfileByUsername(username: string): Promise<Therapist | null>;

  createTherapyTypes(types: TherapistType[]): Promise<TherapistType[]>;

  findTherapistsByTherapyId(
    therapyId: string,
    skip: number,
    take: number,
  ): Promise<{ therapist: Therapist; therapistTypes: TherapistType[] }[]>;

  getTherapistProfileById(therapistId: string): Promise<Therapist | null>;

  approveTherapistProfile(id: string): Promise<void>;

  countTherapistHasTherapyId(therapyId: string): Promise<number>;

  putTherapistWorkSchedule(
    therapistId: string,
    workSchedule: WorkingHours[],
  ): Promise<void>;

  getTherapistWorkSchedule(therapistId: string): Promise<WorkingHours[]>;
}
