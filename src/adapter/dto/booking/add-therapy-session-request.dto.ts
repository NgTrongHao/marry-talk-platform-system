import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, Matches } from 'class-validator';
import { IsFutureDate } from '../../../infrastructure/security/decorator/date-constraint.decorator';

export class AddTherapySessionRequestDto {
  @ApiProperty({
    description: 'Session date in YYYY-MM-DD format',
    example: '2021-12-31',
  })
  @IsNotEmpty({ message: 'Session date is required' })
  @IsDateString()
  @IsFutureDate({ message: 'Session date must be today or in the future' })
  sessionDate: Date;

  @ApiProperty({ description: 'Start time in HH:mm format', example: '10:00' })
  @IsNotEmpty({ message: 'Start time is required' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:mm format',
  })
  startTime: string;
}
