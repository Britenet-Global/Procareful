import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { EUserAssessmentAreas } from '../types';

@Injectable()
export class GetAssessmentScoreByAreaValidationPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (value) {
      const isValid = Object.values(EUserAssessmentAreas).includes(value as EUserAssessmentAreas);
      if (!isValid) {
        throw new BadRequestException(
          `Invalid form type. Allowed values: ${Object.values(EUserAssessmentAreas).join(', ')}`,
        );
      }
      return value;
    }
  }
}
