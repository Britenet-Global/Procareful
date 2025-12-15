import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsEnum, IsOptional } from 'class-validator';
import {
  EActivityLevel,
  EBreathingExerciseSitting,
  EPhysicalExercisesNoMobilityLimitationsCondensed,
  EWalkingLevel,
} from '../types';
import { EPersonalGrowth } from '../schedules/types';

export class ScheduleNoLimitationsDto {
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(4)
  @ArrayUnique()
  @IsEnum(EPhysicalExercisesNoMobilityLimitationsCondensed, { each: true })
  user_physical_exercises: EPhysicalExercisesNoMobilityLimitationsCondensed[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @ArrayUnique()
  @IsEnum(EBreathingExerciseSitting, { each: true })
  user_breathing_exercises: EBreathingExerciseSitting[];

  @IsEnum(EActivityLevel)
  breathing_level: EActivityLevel;

  @IsEnum(EActivityLevel)
  physical_level: EActivityLevel;

  @IsEnum(EWalkingLevel, { each: true })
  user_walking_exercises: EWalkingLevel;

  @IsOptional()
  @IsEnum(EPersonalGrowth)
  personal_growth?: EPersonalGrowth;
}
