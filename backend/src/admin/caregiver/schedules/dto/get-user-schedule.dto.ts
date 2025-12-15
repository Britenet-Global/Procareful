import {
  EActivityLevel,
  EBreathingExercisePosition,
  EBreathingExerciseType,
  EPhysicalExercisePosition,
  EPhysicalExercises,
  EWalkingLevel,
} from '../../types';
import { EPersonalGrowth } from '../types';

export class GetUserScheduleDto {
  id: number;
  created_at: Date;
  breathing_level: EActivityLevel;
  physical_level: EActivityLevel;
  user_physical_exercises: UserPhysicalExerciseDto[];
  user_breathing_exercises: UserBreathingExerciseDto[];
  personal_growth: EPersonalGrowth;
  start_date: Date;
  user_walking_exercises?: UserWalkingExerciseDto | null;
}

class UserPhysicalExerciseDto {
  id: number;
  created_at: Date;
  name: EPhysicalExercises;
  position: EPhysicalExercisePosition;
}

export class UserBreathingExerciseDto {
  id: number;
  created_at: Date;
  name: EBreathingExerciseType;
  position: EBreathingExercisePosition;
}

export class UserWalkingExerciseDto {
  id: number;
  created_at: Date;
  walking_level: EWalkingLevel;
  time: number;
}
