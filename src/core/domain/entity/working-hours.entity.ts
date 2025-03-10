import { Entity } from '../../base/entity';
import { DayOfWeek } from './enum/day-of-week.enum';

interface WorkingHoursProps {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

export class WorkingHours extends Entity<WorkingHoursProps> {
  private constructor(props: WorkingHoursProps) {
    super(props);
  }

  public static build(props: WorkingHoursProps): WorkingHours {
    return new WorkingHours(props);
  }

  public static updateWorkingHours({
    workingHours,
  }: {
    workingHours: {
      dayOfWeek: DayOfWeek;
      startTime: string;
      endTime: string;
    }[];
  }): WorkingHours[] {
    if (!workingHours || workingHours.length === 0) {
      throw new Error('Working hours cannot be empty');
    }

    workingHours.forEach((workingHour) => {
      if (!workingHour.startTime || !workingHour.endTime) {
        throw new Error('Start time and end time cannot be empty');
      } else if (workingHour.endTime <= workingHour.startTime) {
        throw new Error('End time must be greater than start time');
      }
    });

    return workingHours.map((workingHour) => WorkingHours.build(workingHour));
  }

  get dayOfWeek(): DayOfWeek {
    return this.props.dayOfWeek;
  }

  get startTime(): string {
    return this.props.startTime;
  }

  get endTime(): string {
    return this.props.endTime;
  }
}
