import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsEnum, IsOptional } from 'class-validator';
import { EActivityLevel, EBreathingExerciseBedridden, EPhysicalExercisesBedridden } from '../types';
import { EPersonalGrowth } from '../schedules/types';

export class ScheduleBedriddenDto {
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(5)
  @ArrayUnique()
  @IsEnum(EPhysicalExercisesBedridden, { each: true })
  user_physical_exercises: EPhysicalExercisesBedridden[];

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2)
  @ArrayUnique()
  @IsEnum(EBreathingExerciseBedridden, { each: true })
  user_breathing_exercises: EBreathingExerciseBedridden[];

  @IsEnum(EActivityLevel)
  breathing_level: EActivityLevel;

  @IsEnum(EActivityLevel)
  physical_level: EActivityLevel;

  @IsOptional()
  @IsEnum(EPersonalGrowth)
  personal_growth?: EPersonalGrowth;
}
