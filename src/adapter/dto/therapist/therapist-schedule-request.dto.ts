import { WorkingHoursInfoDto } from '../../../application/therapist-management/service/dto/working-hours-info.dto';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TherapistScheduleRequest {
  @ApiProperty({ type: [WorkingHoursInfoDto] })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursInfoDto)
  workingHours: WorkingHoursInfoDto[];
}
