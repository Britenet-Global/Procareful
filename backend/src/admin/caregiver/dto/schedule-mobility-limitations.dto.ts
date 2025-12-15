import { ArrayMaxSize, ArrayMinSize, ArrayUnique, IsArray, IsEnum, IsOptional } from 'class-validator';
import { EActivityLevel, EBreathingExerciseSitting, EPhysicalExercisesMobilityLimitations } from '../types';
import { MaxTwoExercisesPerPosition } from '../../../common/decorators/maxTwoExercisesPerPosition.decorator';
import { EPersonalGrowth } from '../schedules/types';

export class ScheduleMobilityLimitationsDto {
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(6)
  @ArrayUnique()
  @IsEnum(EPhysicalExercisesMobilityLimitations, { each: true })
  @MaxTwoExercisesPerPosition()
  user_physical_exercises: EPhysicalExercisesMobilityLimitations[];

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

  @IsOptional()
  @IsEnum(EPersonalGrowth)
  personal_growth?: EPersonalGrowth;
}
