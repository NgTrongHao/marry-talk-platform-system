import { User } from '../entity/user.entity';
import { Role } from '../entity/enum/role.enum';

export interface UserRepository {
  createUser(user: User): Promise<User>;

  findByEmail(email: string): Promise<User | null>;

  findByUsername(username: string): Promise<User | null>;

  save(user: User): Promise<User>;

  findById(userId: string): Promise<User | null>;

  countTotalUsers(
    startDate: Date | undefined,
    endDate: Date | undefined,
  ): Promise<number>;

  findAll(skip: number, limit: number): Promise<User[]>;

  getTotalUsers(
    fromDate: Date | undefined,
    toDate: Date | undefined,
    role: Role | undefined,
  ): Promise<number>;
}
