import { Injectable, NotAcceptableException } from '@nestjs/common';
import { FirebaseAuthRepository } from '../../repository/firebase-auth.repository';
import { FirebaseUserEntity } from '../../type/firebase-user.entity';

@Injectable()
export class FirebaseVerifyIdTokenUsecase {
  constructor(private readonly authRepository: FirebaseAuthRepository) {}

  async execute(token: string): Promise<FirebaseUserEntity> {
    try {
      const decodedToken = await this.authRepository.verifyToken(token);
      return new FirebaseUserEntity(
        decodedToken.uid,
        decodedToken.email!,
        decodedToken.name!,
        decodedToken.picture,
      );
    } catch {
      throw new NotAcceptableException('Invalid google token');
    }
  }
}
