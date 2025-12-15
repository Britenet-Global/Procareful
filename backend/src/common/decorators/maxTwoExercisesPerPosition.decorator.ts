import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { EPhysicalExercisePosition, EPhysicalExercisesMobilityLimitations } from '../../admin/caregiver/types';
import { UserPhysicalExercises } from '../../admin/caregiver/entities/userPhysicalExercises.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@ValidatorConstraint({ name: 'MaxTwoExercisesPerPositionConstraint', async: true })
@Injectable()
export class MaxTwoExercisesPerPositionConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(UserPhysicalExercises) private userPhysicalRepository: Repository<UserPhysicalExercises>,
  ) {}

  async validate(physical_exercises: EPhysicalExercisesMobilityLimitations[]): Promise<boolean> {
    const exercises = await this.userPhysicalRepository.findBy({
      name: In(physical_exercises),
    });

    const positionCounts: { [key in EPhysicalExercisePosition]?: number } = {
      [EPhysicalExercisePosition.SITTING_LOWER_BODY]: 0,
      [EPhysicalExercisePosition.SITTING_UPPER_BODY]: 0,
      [EPhysicalExercisePosition.SITTING_BALANCE_AND_COORDINATION]: 0,
    };

    exercises
      .filter(
        ({ position }) =>
          position !== EPhysicalExercisePosition.EXERCISE_IN_BED &&
          position !== EPhysicalExercisePosition.FALL_PREVENTION,
      )
      .forEach(({ position }) => {
        if (position in positionCounts) {
          positionCounts[position]++;
        }
      });

    return Object.values(positionCounts).every((count) => count >= 1 && count <= 2);
  }

  defaultMessage(): string {
    return 'Each position (SITTING_LOWER_BODY, SITTING_UPPER_BODY, SITTING_BALANCE_AND_COORDINATION) must have 1 to 2 exercises.';
  }
}

export function MaxTwoExercisesPerPosition(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: MaxTwoExercisesPerPositionConstraint,
    });
  };
}
