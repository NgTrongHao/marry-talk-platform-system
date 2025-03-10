import { Injectable } from '@nestjs/common';
import {
  FirebaseLoginUsecase,
  FirebaseLoginUsecaseCommand,
} from './usecase/firebase-login.usecase';
import { IFirebaseService } from '../firebase-service.interface';
import { FirebaseUploadUsecase } from './usecase/firebase-upload.usecase';

@Injectable()
export class FirebaseService implements IFirebaseService {
  constructor(
    private firebaseLoginUsecase: FirebaseLoginUsecase,
    private firebaseUploadUsecase: FirebaseUploadUsecase,
  ) {}

  async loginWithGoogle(request: FirebaseLoginUsecaseCommand) {
    return await this.firebaseLoginUsecase.execute(request);
  }

  async uploadFile(file: Express.Multer.File) {
    // check if pdf save to pdf folder
    if (file.mimetype === 'application/pdf') {
      return await this.firebaseUploadUsecase.execute(file, 'pdf');
    } else {
      return await this.firebaseUploadUsecase.execute(file, 'images');
    }
  }
}
