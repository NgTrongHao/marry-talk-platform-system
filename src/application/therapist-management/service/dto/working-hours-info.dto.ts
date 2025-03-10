import { ApiProperty } from '@nestjs/swagger';
import { DayOfWeek } from '../../../../core/domain/entity/enum/day-of-week.enum';
import { IsEnum, Matches } from 'class-validator';
import { WorkingHours } from '../../../../core/domain/entity/working-hours.entity';

export class WorkingHoursInfoDto {
  @ApiProperty({ enum: DayOfWeek })
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @ApiProperty({ example: '08:00' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format (HH:mm)',
  })
  startTime: string;

  @ApiProperty({ example: '17:00' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format (HH:mm)',
  })
  endTime: string;

  constructor(dayOfWeek: DayOfWeek, startTime: string, endTime: string) {
    this.dayOfWeek = dayOfWeek;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  public static fromEntity(workingSchedule: WorkingHours) {
    return new WorkingHoursInfoDto(
      workingSchedule.dayOfWeek,
      workingSchedule.startTime,
      workingSchedule.endTime,
    );
  }
}
