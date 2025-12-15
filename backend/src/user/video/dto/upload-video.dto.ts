import { IsEnum, IsNotEmpty } from 'class-validator';
import { EMergedExercisePosition, EMergedPhysicalExericsesWithoutWalking } from '../../../admin/caregiver/types';
import { IsEnumValuesValid } from '../../../common/decorators';

export class UploadVideoDto {
  @IsNotEmpty()
  @IsEnumValuesValid(EMergedPhysicalExericsesWithoutWalking)
  @IsEnum(EMergedPhysicalExericsesWithoutWalking)
  exerciseName: EMergedPhysicalExericsesWithoutWalking;

  @IsNotEmpty()
  @IsEnum(EMergedExercisePosition)
  position: EMergedExercisePosition;
}
