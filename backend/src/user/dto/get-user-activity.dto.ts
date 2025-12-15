import {
  EBreathingExercisePosition,
  EBreathingExerciseType,
  EPhysicalExercisePosition,
  EPhysicalExercises,
  EWalkingExercises,
} from '../../admin/caregiver/types';
import { ApiProperty } from '@nestjs/swagger';

export class GetUserActivityDto {
  id: number;
  created_at: Date;
  @ApiProperty({
    enum: [
      ...Object.values(EPhysicalExercises),
      ...Object.values(EBreathingExerciseType),
      ...Object.values(EWalkingExercises),
    ],
  })
  name: EPhysicalExercises | EBreathingExerciseType | EWalkingExercises;
  description: string;
  @ApiProperty({ enum: [...Object.values(EBreathingExercisePosition), ...Object.values(EPhysicalExercisePosition)] })
  position: EBreathingExercisePosition | EPhysicalExercisePosition;
  video: {
    id: number;
  };
  repetitions?: number;
  time?: number;
  times_per_day?: number;
  times_per_week?: number;
}
