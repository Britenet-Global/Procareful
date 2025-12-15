import type { GetScheduleDto } from '@Procareful/common/api';

export const verifyDashboardData = (schedule?: GetScheduleDto) => {
  if (!schedule) {
    return {};
  }

  const hasPhysicalExercises = 'physicalExercises' in schedule;
  const hasPhysicalExercisesMorning = 'physicalExercisesMorning' in schedule;
  const hasPhysicalExercisesMidDay = 'physicalExercisesMidDay' in schedule;
  const hasBreathingExercises = 'breathingExercises' in schedule;
  const hasBreathingExercisesMorning = 'breathingExercisesMorning' in schedule;
  const hasBreathingExercisesMidDay = 'breathingExercisesMidDay' in schedule;
  const hasWalkingExercises = 'walkingExercises' in schedule;
  const hasPersonalGrowth = 'personalGrowth' in schedule;

  return {
    hasPhysicalExercises,
    hasPhysicalExercisesMorning,
    hasPhysicalExercisesMidDay,
    hasBreathingExercises,
    hasBreathingExercisesMorning,
    hasBreathingExercisesMidDay,
    hasWalkingExercises,
    hasPersonalGrowth,
  };
};
