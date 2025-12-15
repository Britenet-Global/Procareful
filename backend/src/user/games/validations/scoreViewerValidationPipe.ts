import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { EScoreViewer } from '../types';

@Injectable()
export class ScoreViewerValidationPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (value) {
      const isValid = Object.values(EScoreViewer).includes(value as EScoreViewer);
      if (!isValid) {
        throw new BadRequestException(
          `Invalid score viewer. Allowed values: ${Object.values(EScoreViewer).join(', ')}`,
        );
      }
    }

    return value;
  }
}
