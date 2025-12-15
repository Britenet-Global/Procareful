import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ESeniorFormType } from '../types';

@Injectable()
export class SeniorFormTypeValidationPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const isValid = Object.values(ESeniorFormType).includes(value as ESeniorFormType);
    if (!isValid) {
      throw new BadRequestException(`Invalid form type. Allowed values: ${Object.values(ESeniorFormType).join(', ')}`);
    }
    return value;
  }
}
