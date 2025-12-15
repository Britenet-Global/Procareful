import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { EActivityLevel, EBreathingExerciseType, EPhysicalExercises, EUserPhysicalActivityGroup } from '../types';

export class GeneratedSingleScheduleDto {
  @IsNotEmpty()
  @IsEnum(EPhysicalExercises)
  physicalActivities: EPhysicalExercises[];

  @IsNotEmpty()
  @IsEnum(EBreathingExerciseType)
  breathingExercises: EBreathingExerciseType[];

  @IsNumber()
  walkingTime: number;
}
export class GenerateSchedulesDto {
  @IsNotEmpty()
  @IsEnum(EUserPhysicalActivityGroup)
  userMobility: EUserPhysicalActivityGroup;

  @IsNotEmpty()
  @IsEnum(EActivityLevel)
  recommendedLevel: EActivityLevel;

  @IsNotEmpty()
  light: GeneratedSingleScheduleDto;

  @IsNotEmpty()
  moderate: GeneratedSingleScheduleDto;

  @IsNotEmpty()
  intense: GeneratedSingleScheduleDto;
}
