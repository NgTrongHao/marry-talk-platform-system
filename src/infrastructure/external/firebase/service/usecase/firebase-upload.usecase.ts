import { FirebaseStorageRepository } from '../../repository/firebase-storage.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FirebaseUploadUsecase {
  constructor(
    private readonly firebaseStorageRepository: FirebaseStorageRepository,
  ) {}

  async execute(file: Express.Multer.File, folder: string): Promise<string> {
    const buffer = Buffer.from(file.buffer);
    const fileName = file.originalname;
    const fileType = file.mimetype;
    return await this.firebaseStorageRepository.uploadFile(
      buffer,
      fileName,
      fileType,
      folder,
    );
  }
}
