class ExercisePropsDto {
  name: string;
  completed: boolean;
}

export class GetUsersActivitiesListDto {
  walking?: ExercisePropsDto[];
  exercise_in_bed?: ExercisePropsDto[];
  sitting_lower_body?: ExercisePropsDto[];
  sitting_upper_body?: ExercisePropsDto[];
  sitting_balance_and_coordination?: ExercisePropsDto[];
  fall_prevention?: ExercisePropsDto[];
  exercise_sitting?: ExercisePropsDto[];
}
