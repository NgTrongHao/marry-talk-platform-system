import * as bcrypt from 'bcrypt';
import { HashPasswordService } from '../../../application/user/service/hash-password.service';

export class BcryptService implements HashPasswordService {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
