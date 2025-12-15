import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { EActivityLevel } from '../types';

@Injectable()
export class ActivityLevelValidationPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const isValid = Object.values(EActivityLevel).includes(value as EActivityLevel);
    if (!isValid) {
      throw new BadRequestException(
        `Invalid activity level. Allowed values: ${Object.values(EActivityLevel).join(', ')}`,
      );
    }
    return value;
  }
}
