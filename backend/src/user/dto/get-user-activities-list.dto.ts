import { IsEnum } from 'class-validator';
import { EUserExerciseTypes } from '../types';

export class GetUserActivitiesListDto {
  @IsEnum(EUserExerciseTypes)
  exercise_type: EUserExerciseTypes;
}
