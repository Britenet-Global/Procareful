import {
  balanceAndCoordinationExercises,
  lowerBodyExercises,
  PathRoutes,
  upperBodyExercises,
} from '@ProcarefulAdmin/constants';
import {
  type ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem,
  ScheduleNoLimitationsDtoUserPhysicalExercisesItem,
  type UserPhysicalExerciseDto,
} from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { SearchParams } from '@Procareful/common/lib';

export const transformExercises = (exercises?: UserPhysicalExerciseDto[]): string[] => {
  if (!exercises?.length) {
    return [];
  }

  const exerciseNames = exercises.map(exercise => exercise.name);
  const result: Set<string> = new Set();

  exerciseNames.forEach(name => {
    if (name.startsWith('lifting_leg_')) {
      result.add(ScheduleNoLimitationsDtoUserPhysicalExercisesItem.lifting_leg);
    } else {
      result.add(name);
    }
  });

  return Array.from(result);
};

const formatExercises = (
  exercises: UserPhysicalExerciseDto[],
  allExercises: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem[]
): ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem[] =>
  exercises.reduce<ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem[]>((acc, exercise) => {
    if (
      allExercises.includes(
        exercise.name as unknown as ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem
      )
    ) {
      acc.push(exercise.name as unknown as ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem);
    }

    return acc;
  }, []);

export const splittedMobilityLimitationExercises = (exercises?: UserPhysicalExerciseDto[]) => {
  if (!exercises?.length) {
    return {};
  }

  const allLowerBodyExercises = lowerBodyExercises.map(exercise => exercise.value);
  const allUpperBodyExercises = upperBodyExercises.map(exercise => exercise.value);
  const allBalanceAndCoordinationExercises = balanceAndCoordinationExercises.map(
    exercise => exercise.value
  );

  const formattedLowerBodyExercises = formatExercises(exercises, allLowerBodyExercises);
  const formattedUpperBodyExercises = formatExercises(exercises, allUpperBodyExercises);
  const formattedBalanceAndCoordinationExercises = formatExercises(
    exercises,
    allBalanceAndCoordinationExercises
  );

  return {
    fetchedLowerBodyExercises: formattedLowerBodyExercises,
    fetchedUpperBodyExercises: formattedUpperBodyExercises,
    fetchedBalanceAndCoordinationExercises: formattedBalanceAndCoordinationExercises,
  };
};

export const getSeniorCarePlanRedirectConfig = (seniorId: number) => ({
  pathname: PathRoutes.SeniorProfile,
  search: new URLSearchParams({
    [SearchParams.Id]: seniorId.toString(),
    [SearchParams.Name]: i18n.t('admin_title_care_plan'),
  }).toString(),
});
