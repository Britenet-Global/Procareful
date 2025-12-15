import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { I18nService, I18nContext } from 'nestjs-i18n';
import { EDifficultyFeedback, EPersonalRate } from 'src/user/types';

@ValidatorConstraint({ name: 'IsRatingValidConstraint', async: true })
export class IsRatingValidConstraint implements ValidatorConstraintInterface {
  constructor(private readonly i18n: I18nService) {}

  validate(feedback: EDifficultyFeedback[], args: ValidationArguments): boolean {
    const { rating } = args.object as { rating: EPersonalRate };

    if (
      rating === EPersonalRate.VERY_DISSATISFIED ||
      rating === EPersonalRate.DISSATISFIED ||
      rating === EPersonalRate.NEUTRAL
    ) {
      return Array.isArray(feedback) && feedback.every((item) => Object.values(EDifficultyFeedback).includes(item));
    }

    return feedback === undefined || (Array.isArray(feedback) && feedback.length === 0);
  }

  defaultMessage(args: ValidationArguments): string {
    const lang = I18nContext.current().lang;
    const acceptedValues = [EPersonalRate.VERY_DISSATISFIED, EPersonalRate.DISSATISFIED, EPersonalRate.NEUTRAL].join(
      ', ',
    );

    return this.i18n.t('translation.validation.FEEDBACK_RATING', {
      lang,
      args: {
        property: args.property,
        acceptedValues,
      },
    });
  }
}

export function IsRatingValid(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'IsRatingValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRatingValidConstraint,
    });
  };
}
