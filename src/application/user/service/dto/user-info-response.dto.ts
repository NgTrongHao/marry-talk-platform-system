import { User } from '../../../../core/domain/entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserInfoResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(user: User) {
    this.userId = user.id!;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.username = user.username;
    this.role = user.role?.toString() ?? '';
    this.createdAt = user.createdAt!;
    this.updatedAt = user.updatedAt!;
  }
}
