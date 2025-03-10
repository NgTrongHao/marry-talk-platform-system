import { Entity } from '../../base/entity';
import { User } from './user.entity';

interface MemberProps {
  user: User;
  birthdate?: Date;
  phoneNumber?: string;
  avatarImageURL?: string;
}

export class Member extends Entity<MemberProps> {
  private constructor(props: MemberProps) {
    super(props);
  }

  public static build(props: MemberProps): Member {
    return new Member(props);
  }

  public static create(
    user: User,
    birthdate?: Date,
    phoneNumber?: string,
    avatarImageURL?: string,
  ): Member {
    if (!user) {
      throw new Error('User cannot be null');
    }

    if (phoneNumber && !this.isValidPhoneNumber(phoneNumber)) {
      throw new Error('Invalid phone number format');
    }

    if (avatarImageURL && !this.isValidUrl(avatarImageURL)) {
      throw new Error('Invalid avatar image URL');
    }

    return new Member({
      user,
      birthdate: birthdate ? new Date(birthdate) : undefined,
      phoneNumber,
      avatarImageURL,
    });
  }

  private static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private static isValidPhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return phoneRegex.test(phoneNumber);
  }

  get user(): User {
    return this.props.user;
  }

  get birthdate(): Date | undefined {
    return this.props.birthdate;
  }

  get phoneNumber(): string | undefined {
    return this.props.phoneNumber;
  }

  get avatarImageURL(): string | undefined {
    return this.props.avatarImageURL;
  }
}
