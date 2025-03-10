import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsPhoneNumber,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';

export class CreateTherapistProfileRequestDto {
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  @ValidateIf((o: CreateTherapistProfileRequestDto) => o.birthdate != null)
  birthdate?: Date;

  @ApiProperty()
  @IsPhoneNumber('VN')
  @ValidateIf((o: CreateTherapistProfileRequestDto) => o.phoneNumber != null)
  phoneNumber?: string;

  @ApiProperty()
  @IsUrl()
  @ValidateIf((o: CreateTherapistProfileRequestDto) => o.avatarImageURL != null)
  avatarImageURL?: string;

  @ApiProperty()
  @ValidateIf((o: CreateTherapistProfileRequestDto) => o.bio != null)
  @IsString()
  bio?: string;

  @ApiProperty()
  @IsArray()
  expertCertificates: string[];

  @ApiProperty()
  @ValidateIf(
    (o: CreateTherapistProfileRequestDto) => o.professionalExperience != null,
  )
  @IsString()
  professionalExperience?: string;

  @ApiProperty()
  @IsArray()
  therapistTypes: string[];
}
