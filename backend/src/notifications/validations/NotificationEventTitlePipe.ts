import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ENotificationTitle } from '../types';

@Injectable()
export class NotificationEventTitlePipe implements PipeTransform {
  transform(value: ENotificationTitle[]): ENotificationTitle[] {
    if (Array.isArray(value)) {
      const isValid = value.every((title) => Object.values(ENotificationTitle).includes(title as ENotificationTitle));
      if (!isValid) {
        throw new BadRequestException(
          `Invalid notification title. Allowed values: ${Object.values(ENotificationTitle).join(', ')}`,
        );
      }
      return value;
    }
    throw new BadRequestException('Invalid notification title format.');
  }
}
