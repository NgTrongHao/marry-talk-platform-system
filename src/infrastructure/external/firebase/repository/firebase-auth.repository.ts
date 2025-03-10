import { Injectable } from '@nestjs/common';
import { firebaseAdmin } from '../config/firebase.config';

@Injectable()
export class FirebaseAuthRepository {
  async verifyToken(
    token: string,
  ): Promise<{ name?: string; picture?: string; email?: string; uid: string }> {
    return await firebaseAdmin.auth().verifyIdToken(token);
  }
}
