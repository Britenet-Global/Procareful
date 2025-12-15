class CompletedPhysicalExercise {
  name: string;
  completed: boolean;
}
class CompletedBreathingExercise {
  name: string;
  completed: boolean;
}
class CompletedWalkingExercise {
  time: number;
  completed: boolean;
}
class CompletedPersonalGrowth {
  id?: number;
  title?: string;
  description?: string;
  completed?: boolean;
  allPersonalGrowthChallengesCompleted: boolean;
}
class GameStatusDto {
  completed: boolean;
}
class GetScheduleDto {
  games: GameStatusDto;
  physicalExercises?: CompletedPhysicalExercise[];
  breathingExercises?: CompletedBreathingExercise[];
  physicalExercisesMorning?: CompletedPhysicalExercise[];
  physicalExercisesMidDay?: CompletedPhysicalExercise[];
  breathingExercisesMorning?: CompletedBreathingExercise[];
  breathingExercisesMidDay?: CompletedBreathingExercise[];
  walkingExercises?: CompletedWalkingExercise;
  personalGrowth?: CompletedPersonalGrowth;
}
export class GetDashboardDto {
  firstName: string;
  schedule: GetScheduleDto;
  dailyProgress: number;
  totalTasks: number;
  completedTasks: number;
}
