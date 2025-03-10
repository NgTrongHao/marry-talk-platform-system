import { ApiProperty } from '@nestjs/swagger';
import { Therapist } from '../../../../core/domain/entity/therapist.entity';
import { UserInfoResponseDto } from './user-info-response.dto';
import { TherapistTypeInfoResponseDto } from './therapist-type-info-response.dto';

export class TherapistInfoResponseDto extends UserInfoResponseDto {
  @ApiProperty()
  birthdate?: Date;

  @ApiProperty()
  phoneNumber?: string;

  @ApiProperty()
  avatarImageURL?: string;

  @ApiProperty()
  bio?: string;

  @ApiProperty()
  expertCertificates: string[];

  @ApiProperty()
  professionalExperience?: string;

  @ApiProperty()
  roleEnabled: boolean;

  @ApiProperty()
  therapistTypes: TherapistTypeInfoResponseDto[];

  constructor(
    therapist: Therapist,
    therapistTypes: TherapistTypeInfoResponseDto[],
  ) {
    super(therapist.user);
    this.birthdate = therapist.birthdate;
    this.phoneNumber = therapist.phoneNumber;
    this.avatarImageURL = therapist.avatarImageURL;
    this.bio = therapist.bio;
    this.expertCertificates = therapist.expertCertificates;
    this.professionalExperience = therapist.professionalExperience;
    this.roleEnabled = therapist.roleEnabled;
    this.therapistTypes = therapistTypes;
  }
}
