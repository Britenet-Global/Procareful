import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { I18nContext, I18nService } from 'nestjs-i18n';

@ValidatorConstraint({ name: 'IsNotEnumValuesConstraint', async: false })
export class IsNotEnumValuesConstraint implements ValidatorConstraintInterface {
  constructor(private readonly i18n: I18nService) {}

  validate(values: string[], args: ValidationArguments): boolean {
    const [enumType, excludedValues] = args.constraints;
    if (!Array.isArray(values)) {
      return false;
    }
    const enumValues = Object.values(enumType);
    return values.every((value) => enumValues.includes(value) && !excludedValues.includes(value));
  }

  defaultMessage(args: ValidationArguments): string {
    const lang = I18nContext.current().lang;
    const [enumType, excludedValues] = args.constraints;
    const allowedValues = Object.values(enumType).filter((value) => !excludedValues.includes(value));
    const allowedValuesStr = allowedValues.join(', ');
    return this.i18n.t(`translation.validation.EXCLUDED_VALUES`, {
      lang,
      args: {
        property: args.property,
        allowedValues: allowedValuesStr,
      },
    });
  }
}

export function IsNotEnumValues(enumType: object, excludedValues: string[], validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'IsNotEnumValues',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [enumType, excludedValues],
      validator: IsNotEnumValuesConstraint,
    });
  };
}
