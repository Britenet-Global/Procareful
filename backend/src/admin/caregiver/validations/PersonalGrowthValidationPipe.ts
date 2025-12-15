import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { EPersonalGrowth } from '../schedules/types';

@Injectable()
export class PersonalGrowthValidationPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (value) {
      const isValid = Object.values(EPersonalGrowth).includes(value as EPersonalGrowth);
      if (!isValid) {
        throw new BadRequestException(
          `Invalid personal growth. Allowed values: ${Object.values(EPersonalGrowth).join(', ')}`,
        );
      }
      return value;
    }
  }
}
