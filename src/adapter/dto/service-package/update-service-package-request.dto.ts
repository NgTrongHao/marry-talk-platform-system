import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, ValidateIf } from 'class-validator';

export class UpdateServicePackageRequestDto {
  @ApiProperty()
  @IsString()
  @ValidateIf((o: UpdateServicePackageRequestDto) => o.name != null)
  name?: string;

  @ApiProperty()
  @IsInt()
  @ValidateIf((o: UpdateServicePackageRequestDto) => o.sessions != null)
  sessions?: number;
}
