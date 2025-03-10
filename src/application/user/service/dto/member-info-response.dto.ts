import { Member } from '../../../../core/domain/entity/member.entity';
import { UserInfoResponseDto } from './user-info-response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MemberInfoResponseDto extends UserInfoResponseDto {
  @ApiProperty()
  birthdate?: Date;

  @ApiProperty()
  phoneNumber?: string;

  @ApiProperty()
  avatarImageURL?: string;

  constructor(member: Member) {
    super(member.user);
    this.birthdate = member.birthdate;
    this.phoneNumber = member.phoneNumber;
    this.avatarImageURL = member.avatarImageURL;
  }
}
