import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ESortOrder } from '../../../common/types';

@Injectable()
export class SortOrderValidationPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (value) {
      const isValid = Object.values(ESortOrder).includes(value as ESortOrder);
      if (!isValid) {
        throw new BadRequestException(`Invalid sort order. Allowed values: ${Object.values(ESortOrder).join(', ')}`);
      }
      return value;
    }
  }
}
