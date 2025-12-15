import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneNumberRegex = /^\+[0-9]{1,3}-[0-9]{6,12}$/;
  return phoneNumberRegex.test(phoneNumber);
};

@ValidatorConstraint({ name: 'IsPhoneNumberValidConstraint', async: true })
@Injectable()
export class IsPhoneNumberValidConstraint implements ValidatorConstraintInterface {
  validate(phoneNumber: string): boolean {
    return validatePhoneNumber(phoneNumber);
  }

  defaultMessage(): string {
    return 'translation.validation.PHONE_NUMBER';
  }
}

export function IsPhoneNumberValid(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'IsPhoneNumberValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberValidConstraint,
    });
  };
}
