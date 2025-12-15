import { Injectable, PipeTransform, BadRequestException, Optional } from '@nestjs/common';
import * as path from 'path';
import { FileArray } from '../../notes/types';

@Injectable()
export class FilesValidationPipe implements PipeTransform {
  private readonly allowedExtensions = ['.png', '.jpg', '.jpeg', '.pdf', '.docx', '.txt', '.xls', '.xlsx'];
  private readonly maxSize = 5 * 1024 * 1024;

  constructor(@Optional() private readonly isOptional: boolean = false) {}

  transform(files: FileArray): FileArray {
    if (!this.isOptional && (!files || !files.files || files.files.length === 0)) {
      throw new BadRequestException('No files provided.');
    }

    if (files && Array.isArray(files.files) && files.files.length > 5) {
      throw new BadRequestException('Max number of attachments is 5.');
    }

    if (files && Array.isArray(files.files)) {
      files.files.forEach((file) => {
        const { originalname, buffer } = file;
        const fileExt = path.extname(originalname).toLowerCase();
        if (!this.allowedExtensions.includes(fileExt)) {
          throw new BadRequestException(
            `File type ${fileExt} is not allowed. Allowed types are: png, jpg, jpeg, pdf, docx, txt, xls, xlsx`,
          );
        }

        if (buffer.length > this.maxSize) {
          throw new BadRequestException(
            `File size exceeds the maximum allowed size of ${this.maxSize / 1024 / 1024} MB.`,
          );
        }
      });
    }

    return files;
  }
}
