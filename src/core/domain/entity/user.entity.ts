import { Entity } from '../../base/entity';
import { Role } from './enum/role.enum';
import { HashPasswordService } from '../../../application/user/service/hash-password.service';

interface UserProps {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps) {
    super(props);
  }

  public static build(props: UserProps): User {
    return new User(props);
  }

  public static async create(
    props: UserProps,
    hashService: HashPasswordService,
  ): Promise<User> {
    props.id = props.id || Entity.generateId();
    props.role = Role.REGISTRAR;
    props.password = await hashService.hash(props.password);
    return new User(props);
  }

  public static async validatePassword(
    password: string,
    hashedPassword: string,
    hashService: HashPasswordService,
  ): Promise<boolean> {
    return await hashService.compare(password, hashedPassword);
  }

  // Getters
  get id(): string | undefined {
    return this.props.id;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get email(): string {
    return this.props.email;
  }

  get username(): string {
    return this.props.username;
  }

  get password(): string {
    return this.props.password;
  }

  get role(): Role | undefined {
    return this.props.role;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  // if user is registrar they can change their role to MEMBER/THERAPIST if not just admin can change role
  setRole(newRole: Role) {
    if (this.role !== Role.ADMIN && this.role !== Role.REGISTRAR) {
      throw new Error('Only ADMIN or REGISTRAR can change roles');
    }

    if (this.role === Role.REGISTRAR && newRole === Role.ADMIN) {
      throw new Error('REGISTRAR cannot assign ADMIN role');
    }

    this.props.role = newRole;
  }

  async changePassword(newPassword: string, hashService: HashPasswordService) {
    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
    this.props.password = await hashService.hash(newPassword);
  }
}
