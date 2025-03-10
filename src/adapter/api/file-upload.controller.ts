import {
  BadRequestException,
  Controller,
  Inject,
  Post,
  ServiceUnavailableException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IFirebaseService } from '../../infrastructure/external/firebase/firebase-service.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { BaseResponseDto } from '../dto/base-response.dto';
import { JwtAuthGuard } from '../../infrastructure/security/guard/jwt-auth.guard';

@Controller('file-upload')
@ApiTags('File Upload')
export class FileUploadController {
  constructor(
    @Inject('IFirebaseService')
    private readonly firebaseService: IFirebaseService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload File REST API',
    description:
      'Upload File REST API is used to upload a file (images, PDFs, etc.).',
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'File too large' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    } else if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('File too large');
    }

    try {
      return new BaseResponseDto(201, {
        url: await this.firebaseService.uploadFile(file),
      });
    } catch {
      throw new ServiceUnavailableException(
        'File upload is temporarily disabled',
      );
    }
  }
}
