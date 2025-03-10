import { IsDate, IsPhoneNumber, IsUrl, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMemberProfileRequestDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @ValidateIf((o: CreateMemberProfileRequestDto) => o.birthdate != null)
  birthdate?: Date;

  @ApiProperty()
  @IsPhoneNumber('VN')
  @ValidateIf((o: CreateMemberProfileRequestDto) => o.phoneNumber != null)
  phoneNumber?: string;

  @ApiProperty()
  @IsUrl()
  @ValidateIf((o: CreateMemberProfileRequestDto) => o.avatarImageURL != null)
  avatarImageURL?: string;
}
