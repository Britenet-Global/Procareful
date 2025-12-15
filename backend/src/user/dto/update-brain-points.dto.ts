import { IsInt, Min } from 'class-validator';

export class UpdateBrainPoints {
  @IsInt()
  @Min(0)
  points: number;
}
