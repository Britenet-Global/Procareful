import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { EGame } from '../types';

@Injectable()
export class GameValidationPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    const isValid = Object.values(EGame).includes(value as EGame);
    if (!isValid) {
      throw new BadRequestException(`Invalid game name. Allowed values: ${Object.values(EGame).join(', ')}`);
    }
    return value;
  }
}
