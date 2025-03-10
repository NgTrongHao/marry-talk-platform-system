import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { firebaseStorage } from '../config/firebase.config';

@Injectable()
export class FirebaseStorageRepository {
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
    folder: string = 'uploads',
  ): Promise<string> {
    const uniqueFileName = `${folder}/${uuidv4()}-${fileName}`;

    if (!firebaseStorage) {
      throw new InternalServerErrorException('Firebase Storage is disabled');
    }
    const fileRef = firebaseStorage.file(uniqueFileName);

    await fileRef.save(fileBuffer, {
      metadata: {
        contentType: mimeType,
      },
      public: true,
    });

    return `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${uniqueFileName}`;
  }
}
