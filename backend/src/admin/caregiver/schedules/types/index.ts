import { UserPhysicalExercises } from '../../entities/userPhysicalExercises.entity';
import { UserBreathingExercises } from '../../entities/userBreathingExercises.entity';
import { UserWalkingExercises } from '../../entities/userWalkingExercises.entity';
import { EActivityLevel, EBreathingExerciseType, EPhysicalExercises, EUserPhysicalActivityGroup } from '../../types';

export type TBasicSchedule = {
  physicalActivities: EPhysicalExercises[];
  breathingExercises: EBreathingExerciseType[];
};
export type TSchedule = {
  basicSchedule: TBasicSchedule;
  recommendedActivityLevel: EActivityLevel;
  usersMobility: EUserPhysicalActivityGroup;
  declaredWalkingTime: number | null;
};
export type TGeneratedSchedules = {
  userMobility: EUserPhysicalActivityGroup;
  recommendedLevel: EActivityLevel;
  light: TBasicSchedule & { walkingTime: number | null };
  moderate: TBasicSchedule & { walkingTime: number | null };
  intense: TBasicSchedule & { walkingTime: number | null };
};

export type TObjectActivitiesToAssign = {
  user: { id: number };
  breathing_level: EActivityLevel;
  physical_level: EActivityLevel;
  user_physical_exercises: UserPhysicalExercises[];
  user_breathing_exercises: UserBreathingExercises[];
  user_walking_exercises?: UserWalkingExercises;
  personal_growth: EPersonalGrowth;
  activity_group: EUserPhysicalActivityGroup;
};
export enum EPersonalGrowth {
  CONNECT_WITH_YOUTHS = 'connect_with_youths',
  CONNECT_WITH_PEER = 'connect_with_peer',
}
