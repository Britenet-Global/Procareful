import {
  ScheduleBedriddenDtoPersonalGrowth,
  ScheduleNoLimitationsDtoUserWalkingExercises,
  UserWalkingExerciseDtoWalkingLevel,
} from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';

export const COGNITIVE_GAME_FREQUENCY_PER_WEEK = 7;
export const COGNITIVE_GAME_FREQUENCY_PER_DAY = 1;

export const activityDetailsTitle = {
  get physical() {
    return i18n.t('admin_title_physical_exercises');
  },
  get breathing() {
    return i18n.t('shared_title_breathing_exercises');
  },
  get walking() {
    return i18n.t('shared_title_walking');
  },
  get cognitiveGames() {
    return i18n.t('admin_title_cognitive_games');
  },
  get personalGrowth() {
    return i18n.t('senior_title_personal_growth_challenges');
  },
};

export const walkingExerciseLevel = {
  get [UserWalkingExerciseDtoWalkingLevel.same_as_now]() {
    return i18n.t('admin_inf_same_as_now');
  },
  [UserWalkingExerciseDtoWalkingLevel['+10%']]:
    ScheduleNoLimitationsDtoUserWalkingExercises['+10%'],
  [UserWalkingExerciseDtoWalkingLevel['+20%']]:
    ScheduleNoLimitationsDtoUserWalkingExercises['+20%'],
};

export const personalChallengeName = {
  get [ScheduleBedriddenDtoPersonalGrowth.connect_with_youths]() {
    return i18n.t('admin_title_connect_with_youths');
  },
  get [ScheduleBedriddenDtoPersonalGrowth.connect_with_peer]() {
    return i18n.t('admin_title_connect_with_peer');
  },
};
