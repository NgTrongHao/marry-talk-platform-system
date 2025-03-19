import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, ValidateIf } from 'class-validator';

export class UpdatePreMaritalTestRequestDto {
  @ApiProperty()
  @IsString()
  @ValidateIf((o: UpdatePreMaritalTestRequestDto) => o.name != null)
  name: string;

  @ApiProperty()
  @IsString()
  @ValidateIf((o: UpdatePreMaritalTestRequestDto) => o.description != null)
  description: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @ValidateIf(
    (o: UpdatePreMaritalTestRequestDto) => o.therapyCategoryIds != null,
  )
  therapyCategoryIds: string[];
}
