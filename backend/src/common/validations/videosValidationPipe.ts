import { Injectable, PipeTransform, BadRequestException, Optional } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class VideosFilesValidationPipe implements PipeTransform {
  private readonly allowedExtensions = ['.mp4', '.avi', '.mov', '.mkv'];
  private readonly maxSize = 200 * 1024 * 1024;

  constructor(@Optional() private readonly isOptional: boolean = false) {}

  transform(file: Express.Multer.File): Express.Multer.File {
    if (!this.isOptional && !file) {
      throw new BadRequestException('No files provided.');
    }

    if (file) {
      const { originalname, buffer } = file;
      const fileExt = path.extname(originalname).toLowerCase();
      if (!this.allowedExtensions.includes(fileExt)) {
        throw new BadRequestException(
          `File type ${fileExt} is not allowed. Allowed types are: ${this.allowedExtensions.join(', ')}`,
        );
      }

      if (buffer.length > this.maxSize) {
        throw new BadRequestException(
          `File size exceeds the maximum allowed size of ${this.maxSize / 1024 / 1024} MB.`,
        );
      }
    }

    return file;
  }
}
