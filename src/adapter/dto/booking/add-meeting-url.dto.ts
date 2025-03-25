import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class AddMeetingUrlDto {
  @ApiProperty()
  @IsUrl({ require_tld: false })
  meetingLink: string;
}
