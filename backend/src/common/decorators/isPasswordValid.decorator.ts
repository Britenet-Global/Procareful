import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

export const validatePassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&!#"$%&'()*+,-./:;<=>?@[\\\]^_`{|}])[A-Za-z\d@$!%*?&!#"$%&'()*+,-./:;<=>?@[\\\]^_`{|}]{8,}$/;
  return passwordRegex.test(password);
};

@ValidatorConstraint({ name: 'IsPasswordValidConstraint', async: true })
@Injectable()
export class IsPasswordValidConstraint implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    return validatePassword(password);
  }

  defaultMessage(): string {
    return 'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit and at least one special character.';
  }
}

export function IsPasswordValid(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'isPasswordValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordValidConstraint,
    });
  };
}
