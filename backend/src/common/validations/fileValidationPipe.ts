import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import * as path from 'path';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly allowedExtensions = ['.png', '.jpg', '.jpeg'];
  private readonly maxSize = 1000 * 1024;

  transform(value: Express.Multer.File): Express.Multer.File {
    if (!value) {
      throw new BadRequestException('No file selected.');
    }

    const fileExt = path.extname(value.originalname).toLowerCase();

    if (!this.allowedExtensions.includes(fileExt)) {
      throw new BadRequestException(`File type ${fileExt} is not allowed. Allowed types are: png, jpg, jpeg.`);
    }

    if (value.size > this.maxSize) {
      throw new BadRequestException(`File size exceeds the maximum allowed size of ${this.maxSize / 1024} KB.`);
    }

    return value;
  }
}
