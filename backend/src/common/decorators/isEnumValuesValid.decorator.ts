import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  EBreathingExercisePosition,
  EBreathingExerciseType,
  EPhysicalExercisePosition,
  EPhysicalExercises,
} from '../../admin/caregiver/types';
import { UploadVideoDto } from '../../user/video/dto';

interface UploadVideoValidationArguments extends ValidationArguments {
  object: UploadVideoDto;
}

@ValidatorConstraint({ name: 'IsEnumValuesValidConstraint', async: false })
export class IsEnumValuesValidConstraint implements ValidatorConstraintInterface {
  constructor() {}
  validate(value: string, args: UploadVideoValidationArguments): boolean {
    const dto = args.object;

    const isValuePhysicalExercise = Object.values(EPhysicalExercises).some((ex) => ex === value);
    const isValueBreathingExercise = Object.values(EBreathingExerciseType).some((ex) => ex === value);

    if (isValuePhysicalExercise) {
      return Object.values(EPhysicalExercisePosition).some((ex) => ex === dto.position);
    }
    if (isValueBreathingExercise) {
      return Object.values(EBreathingExercisePosition).some((ex) => ex === dto.position);
    }
    return false;
  }

  defaultMessage(): string {
    return 'The name of the exercise must correspond to the exercise position.';
  }
}

export function IsEnumValuesValid(enumType: object, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'IsEnumValuesValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [enumType],
      validator: IsEnumValuesValidConstraint,
    });
  };
}
