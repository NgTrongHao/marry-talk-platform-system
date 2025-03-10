import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';

export class LoginFirebaseRequestDto {
  @ApiProperty()
  @IsString()
  idToken: string;

  @ApiProperty()
  @IsString()
  @ValidateIf((o: LoginFirebaseRequestDto) => o.username != null)
  username?: string;
}
