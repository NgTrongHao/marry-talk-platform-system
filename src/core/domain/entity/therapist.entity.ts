import { User } from './user.entity';
import { Entity } from '../../base/entity';
import { TherapistType } from './therapist-type.entity';

interface TherapistProps {
  user: User;
  birthdate?: Date;
  phoneNumber?: string;
  avatarImageURL?: string;
  bio?: string;
  expertCertificates: string[];
  professionalExperience?: string;
  roleEnabled: boolean;
  therapistTypes: TherapistType[];
  rating?: number;
}

export class Therapist extends Entity<TherapistProps> {
  private constructor(props: TherapistProps) {
    super(props);
  }

  public static build(props: TherapistProps): Therapist {
    return new Therapist(props);
  }

  public static create(
    user: User,
    expertCertificates: string[],
    therapistTypes: string[],
    birthdate?: Date,
    phoneNumber?: string,
    avatarImageURL?: string,
    bio?: string,
    professionalExperience?: string,
  ): Therapist {
    if (!user) {
      throw new Error('User cannot be null');
    }

    if (phoneNumber && !this.isValidPhoneNumber(phoneNumber)) {
      throw new Error('Invalid phone number format');
    }

    if (avatarImageURL && !this.isValidUrl(avatarImageURL)) {
      throw new Error('Invalid avatar image URL');
    }

    // check has 1 or more expert certificates, certificate is url
    if (expertCertificates && expertCertificates.length === 0) {
      throw new Error('Expert certificates cannot be empty');
    } else {
      expertCertificates?.forEach((certificate) => {
        if (!this.isValidUrl(certificate)) {
          throw new Error('Invalid expert certificate URL');
        }
      });
    }

    return new Therapist({
      user,
      birthdate: birthdate ? new Date(birthdate) : undefined,
      phoneNumber,
      avatarImageURL,
      bio,
      expertCertificates,
      professionalExperience,
      roleEnabled: false, // default roleEnabled to false
      therapistTypes: therapistTypes.map((type) =>
        TherapistType.build({
          therapyCategoryId: type,
          therapistId: user.id!,
          enable: true,
        }),
      ),
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

  get bio(): string | undefined {
    return this.props.bio;
  }

  get expertCertificates(): string[] {
    return this.props.expertCertificates;
  }

  get professionalExperience(): string | undefined {
    return this.props.professionalExperience;
  }

  get roleEnabled(): boolean {
    return this.props.roleEnabled;
  }

  get therapistTypes(): TherapistType[] {
    return this.props.therapistTypes;
  }

  get rating(): number {
    return this.props.rating || 0;
  }
}
