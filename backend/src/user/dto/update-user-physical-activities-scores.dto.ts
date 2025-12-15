import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { EExerciseTimeOfDay, EMergedPhysicalExercises } from 'src/admin/caregiver/types';

export class UpdateUserPhysicalActivitiesScoresDto {
  @IsEnum(EMergedPhysicalExercises)
  @ApiProperty({
    enum: EMergedPhysicalExercises,
  })
  name: EMergedPhysicalExercises;

  @IsOptional()
  @IsEnum(EExerciseTimeOfDay)
  time_of_day?: EExerciseTimeOfDay;
}
