import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SessionFlaggingReportRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reportTitle: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;
}
