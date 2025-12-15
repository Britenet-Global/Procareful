export type ProgressActivityExercises = {
  completed: boolean;
} & Record<string, unknown>;

export const progressActivityFormatter = (exercises: ProgressActivityExercises[]) => {
  const completedExercisesCount = exercises.filter(exercise => exercise.completed).length;

  return { completed: completedExercisesCount, total: exercises.length };
};
