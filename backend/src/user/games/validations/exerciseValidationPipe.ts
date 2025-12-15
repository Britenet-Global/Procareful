import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { EBreathingExerciseType, EPhysicalExercises, EWalkingExercises } from '../../../admin/caregiver/types';

@Injectable()
export class ExerciseValidationPipe implements PipeTransform<string, string> {
  transform(value: EWalkingExercises.WALKING_EXERCISE | EPhysicalExercises | EBreathingExerciseType): string {
    const allowedValues = [
      ...Object.values(EWalkingExercises),
      ...Object.values(EPhysicalExercises),
      ...Object.values(EBreathingExerciseType),
    ];
    const isValid = allowedValues.includes(value);
    if (!isValid) {
      throw new BadRequestException(`Invalid exercise name. Allowed values: ${allowedValues.join(', ')}`);
    }
    return value;
  }
}
