import {
  AddGameScoreDtoGameName,
  EditCarePlanReasonDtoEditCarePlanReason,
  GenerateSchedulesDtoRecommendedLevel,
  GenerateSchedulesDtoUserMobility,
  GeneratedSingleScheduleDtoPhysicalActivitiesItem,
  GetUserMobilityLevelRecommendedLevel,
  ScheduleBedriddenDtoPersonalGrowth,
  ScheduleBedriddenDtoUserBreathingExercisesItem,
  ScheduleBedriddenDtoUserPhysicalExercisesItem,
  ScheduleMobilityLimitationsDtoPersonalGrowth,
  ScheduleMobilityLimitationsDtoUserBreathingExercisesItem,
  ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem,
  ScheduleNoLimitationsDtoPersonalGrowth,
  ScheduleNoLimitationsDtoPhysicalLevel,
  ScheduleNoLimitationsDtoUserBreathingExercisesItem,
  ScheduleNoLimitationsDtoUserPhysicalExercisesItem,
  ScheduleNoLimitationsDtoUserWalkingExercises,
  StatusStatusName,
} from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { GAME_NAME } from '@Procareful/common/lib/constants';
import { PersonalGrowth } from './enums';

export const INSTITUTION_NAME_INPUT_MAX_CHARS = 52;
export const MAXIMAL_FILE_SIZE_IN_BYTES_BINARY_1MB = 1 * 1024 * 1024;

export const USER_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const HUMAN_READABLE_FILE_FORMATS = '.png, .jpg, .jpeg, .pdf, .docx, .txt, .xls, .xlsx';
export const ACCEPTED_FILE_FORMATS =
  'image/png,image/jpeg,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const activitiesModalConfig = {
  [GenerateSchedulesDtoUserMobility.bedridden_activities]: {
    [GenerateSchedulesDtoRecommendedLevel.light]: {
      physicalActivities: {
        frequencyPerDay: 1,
        frequencyPerWeek: 0,
        frequencyRepetition: 5,
      },
      breathingExercises: {
        frequencyPerDay: 1,
        frequencyPerWeek: 0,
        frequencyRepetition: 3,
      },
      cognitiveGames: {
        frequencyPerDay: 1,
        frequencyPerWeek: 7,
        frequencyRepetition: 0,
      },
    },
    [GenerateSchedulesDtoRecommendedLevel.moderate]: {
      physicalActivities: {
        frequencyPerDay: 1,
        frequencyPerWeek: 0,
        frequencyRepetition: 10,
      },
      breathingExercises: {
        frequencyPerDay: 1,
        frequencyPerWeek: 0,
        frequencyRepetition: 5,
      },
      cognitiveGames: {
        frequencyPerDay: 1,
        frequencyPerWeek: 7,
        frequencyRepetition: 0,
      },
    },
    [GenerateSchedulesDtoRecommendedLevel.intense]: {
      physicalActivities: {
        frequencyPerDay: 2,
        frequencyPerWeek: 0,
        frequencyRepetition: 10,
      },
      breathingExercises: {
        frequencyPerDay: 2,
        frequencyPerWeek: 0,
        frequencyRepetition: 5,
      },
      cognitiveGames: {
        frequencyPerDay: 1,
        frequencyPerWeek: 7,
        frequencyRepetition: 0,
      },
    },
  },
  [GenerateSchedulesDtoUserMobility.mobility_limitation_activities]: {
    [GenerateSchedulesDtoRecommendedLevel.light]: {
      physicalActivities: {
        frequencyPerDay: 0,
        frequencyPerWeek: 3,
        frequencyRepetition: 5,
      },
      breathingExercises: {
        frequencyPerDay: 0,
        frequencyPerWeek: 3,
        frequencyRepetition: 3,
      },
      cognitiveGames: {
        frequencyPerDay: 1,
        frequencyPerWeek: 7,
        frequencyRepetition: 0,
      },
    },
    [GenerateSchedulesDtoRecommendedLevel.moderate]: {
      physicalActivities: {
        frequencyPerDay: 0,
        frequencyPerWeek: 5,
        frequencyRepetition: 5,
      },
      breathingExercises: {
        frequencyPerDay: 0,
        frequencyPerWeek: 5,
        frequencyRepetition: 5,
      },
      cognitiveGames: {
        frequencyPerDay: 1,
        frequencyPerWeek: 7,
        frequencyRepetition: 0,
      },
    },
    [GenerateSchedulesDtoRecommendedLevel.intense]: {
      physicalActivities: {
        frequencyPerDay: 0,
        frequencyPerWeek: 7,
        frequencyRepetition: 10,
      },
      breathingExercises: {
        frequencyPerDay: 0,
        frequencyPerWeek: 7,
        frequencyRepetition: 5,
      },
      cognitiveGames: {
        frequencyPerDay: 1,
        frequencyPerWeek: 7,
        frequencyRepetition: 0,
      },
    },
  },
  [GenerateSchedulesDtoUserMobility.without_limitation_activities]: {
    [GenerateSchedulesDtoRecommendedLevel.light]: {
      physicalActivities: {
        frequencyPerDay: 0,
        frequencyPerWeek: 3,
        frequencyRepetition: [3, 5],
      },
      breathingExercises: {
        frequencyPerDay: 0,
        frequencyPerWeek: 3,
        frequencyRepetition: 3,
      },
      cognitiveGames: {
        frequencyPerDay: 1,
        frequencyPerWeek: 7,
        frequencyRepetition: 0,
      },
    },
    [GenerateSchedulesDtoRecommendedLevel.moderate]: {
      physicalActivities: {
        frequencyPerDay: 0,
        frequencyPerWeek: 5,
        frequencyRepetition: [5, 10],
      },
      breathingExercises: {
        frequencyPerDay: 0,
        frequencyPerWeek: 5,
        frequencyRepetition: 5,
      },
      cognitiveGames: {
        frequencyPerDay: 1,
        frequencyPerWeek: 7,
        frequencyRepetition: 0,
      },
    },
    [GenerateSchedulesDtoRecommendedLevel.intense]: {
      physicalActivities: {
        frequencyPerDay: 0,
        frequencyPerWeek: 7,
        frequencyRepetition: [5, 10],
      },
      breathingExercises: {
        frequencyPerDay: 0,
        frequencyPerWeek: 7,
        frequencyRepetition: 5,
      },
      cognitiveGames: {
        frequencyPerDay: 1,
        frequencyPerWeek: 7,
        frequencyRepetition: 0,
      },
    },
  },
};

export const exerciseInBed = [
  {
    get label() {
      return i18n.t('admin_inf_exercise_for_feet');
    },
    value: ScheduleBedriddenDtoUserPhysicalExercisesItem.exercise_for_feet,
  },
  {
    get label() {
      return i18n.t('admin_inf_bending_a_leg');
    },
    value: ScheduleBedriddenDtoUserPhysicalExercisesItem.bending_a_leg,
  },
  {
    get label() {
      return i18n.t('admin_inf_lifting_the_heels');
    },
    value: ScheduleBedriddenDtoUserPhysicalExercisesItem.lifting_the_heels,
  },
  {
    get label() {
      return i18n.t('admin_inf_lifting_of_the_hips');
    },
    value: ScheduleBedriddenDtoUserPhysicalExercisesItem.lifting_of_the_hips,
  },
  {
    get label() {
      return i18n.t('admin_inf_knee_exercise_with_a_ball');
    },
    value: ScheduleBedriddenDtoUserPhysicalExercisesItem.knee_exercise_with_a_ball,
  },
  {
    get label() {
      return i18n.t('admin_inf_opening_a_book_knee_exercise');
    },
    value: ScheduleBedriddenDtoUserPhysicalExercisesItem.opening_a_book_knee_exercise,
  },
  {
    get label() {
      return i18n.t('admin_inf_touching_knee_with_an_opposite_hand');
    },
    value: ScheduleBedriddenDtoUserPhysicalExercisesItem.touching_knee_with_an_opposite_hand,
  },
  {
    get label() {
      return i18n.t('admin_inf_lifting_arms_above_your_head');
    },
    value: ScheduleBedriddenDtoUserPhysicalExercisesItem.lifting_arms_above_your_head,
  },
  {
    get label() {
      return i18n.t('admin_inf_hip_flexibility_exercise');
    },
    value: ScheduleBedriddenDtoUserPhysicalExercisesItem.hip_flexibility_exercise,
  },
];

export const lowerBodyExercises = [
  {
    get label() {
      return i18n.t('admin_inf_lifting_of_the_feet');
    },
    value: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem.lifting_of_the_feet_sitting,
  },
  {
    get label() {
      return i18n.t('admin_inf_alternate_step_with_toe_or_heel');
    },
    value: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem.alternate_step_with_toe_or_heel,
  },
  {
    get label() {
      return i18n.t('admin_inf_leg_opening_and_closing_exercise_with_toe_or_heel_support');
    },
    value:
      ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem.leg_opening_and_closing_exercise_with_toe_or_heel_support,
  },
  {
    get label() {
      return i18n.t('admin_inf_skipping_exercise');
    },
    value: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem.skipping_exercise,
  },
  {
    get label() {
      return i18n.t('admin_inf_rotating_legs');
    },
    value: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem.rotating_legs,
  },
];

export const upperBodyExercises = [
  {
    get label() {
      return i18n.t('admin_inf_shoulder_circles');
    },
    value: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem.shoulder_circles,
  },
  {
    get label() {
      return i18n.t('admin_inf_alternating_arm_reaches');
    },
    value: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem.alternating_arm_reaches,
  },
  {
    get label() {
      return i18n.t('admin_inf_spine_twist_with_bent_arm');
    },
    value: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem.spine_twist_with_bent_arm,
  },
  {
    get label() {
      return i18n.t('admin_inf_alternating_arm_lifts');
    },
    value: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem.alternating_arm_lifts,
  },
  {
    get label() {
      return i18n.t('admin_inf_arm_circles');
    },
    value: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem.arm_circles,
  },
];

export const balanceAndCoordinationExercises = [
  {
    get label() {
      return i18n.t('admin_inf_side_bend');
    },
    value: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem.side_bend,
  },
  {
    get label() {
      return i18n.t('admin_inf_spine_twist_with_extended_arm');
    },
    value: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem.spine_twist_with_extended_arm,
  },
  {
    get label() {
      return i18n.t('admin_inf_hip_abduction');
    },
    value: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem.hip_abduction,
  },
  {
    get label() {
      return i18n.t('admin_inf_opposite_arm_and_leg_lift');
    },
    value: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem.opposite_arm_and_leg_lift,
  },
  {
    get label() {
      return i18n.t('admin_inf_sit_to_stand_with_arm_reach');
    },
    value: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem.sit_to_stand_with_arm_reach,
  },
];

export const withoutLimitationsPhysicalExercises = [
  {
    get label() {
      return i18n.t('admin_inf_standing_on_toes');
    },
    value: ScheduleNoLimitationsDtoUserPhysicalExercisesItem.standing_on_toes,
  },
  {
    get label() {
      return i18n.t('admin_inf_leaning_your_body_forward');
    },
    value: ScheduleNoLimitationsDtoUserPhysicalExercisesItem.leaning_the_body_forward,
  },
  {
    get label() {
      return i18n.t('admin_inf_lifting_leg_with_each_type');
    },
    value: ScheduleNoLimitationsDtoUserPhysicalExercisesItem.lifting_leg,
  },
  {
    get label() {
      return i18n.t('admin_inf_bending_knee_lifting_leg_and_touching_it_with_opposite_hand');
    },
    value:
      ScheduleNoLimitationsDtoUserPhysicalExercisesItem.bending_knee_lifting_leg_and_touching_it_with_opposite_hand,
  },
];

export const walkingExercisesOptions = (recommendedType: GetUserMobilityLevelRecommendedLevel) => [
  {
    label: i18n.t('admin_inf_same_as_now'),
    value: ScheduleNoLimitationsDtoUserWalkingExercises.same_as_now,
    isRecommended: recommendedType === GetUserMobilityLevelRecommendedLevel.light ? true : false,
  },
  {
    label: ScheduleNoLimitationsDtoUserWalkingExercises['+10%'],
    value: ScheduleNoLimitationsDtoUserWalkingExercises['+10%'],
    isRecommended: recommendedType === GetUserMobilityLevelRecommendedLevel.moderate ? true : false,
  },
  {
    label: ScheduleNoLimitationsDtoUserWalkingExercises['+20%'],
    value: ScheduleNoLimitationsDtoUserWalkingExercises['+20%'],
    isRecommended: recommendedType === GetUserMobilityLevelRecommendedLevel.intense ? true : false,
  },
];

export const bedriddenBreathingExercisesOptions = [
  {
    get label() {
      return i18n.t('admin_inf_breathing_with_the_prefix');
    },
    value: ScheduleBedriddenDtoUserBreathingExercisesItem.breathing_with_the_prefix,
  },
  {
    get label() {
      return i18n.t('admin_inf_lifting_the_elbows_away');
    },
    value: ScheduleBedriddenDtoUserBreathingExercisesItem.lifting_the_elbow_away_from_the_body,
  },
  {
    get label() {
      return i18n.t('admin_inf_blowing_newspaper_strips');
    },
    value: ScheduleBedriddenDtoUserBreathingExercisesItem.blowing_newspaper_strips_on_the_trapeze,
  },
  {
    get label() {
      return i18n.t('admin_inf_blowing_the_whistle');
    },
    value: ScheduleBedriddenDtoUserBreathingExercisesItem.blowing_the_whistle,
  },
  {
    get label() {
      return i18n.t('admin_inf_blowing_ping_pong_balls');
    },
    value: ScheduleBedriddenDtoUserBreathingExercisesItem.blowing_ping_pong_balls,
  },
  {
    get label() {
      return i18n.t('admin_inf_blowing_soap_bubbles');
    },
    value: ScheduleBedriddenDtoUserBreathingExercisesItem.blowing_soap_bubbles,
  },
];

export const withLimitationsBreathingExercisesOptions = [
  {
    get label() {
      return i18n.t('admin_inf_chest_expansion_breathing');
    },
    value: ScheduleMobilityLimitationsDtoUserBreathingExercisesItem.chest_expansion_breathing,
  },
  {
    get label() {
      return i18n.t('admin_inf_chest_opening_breaths');
    },
    value: ScheduleMobilityLimitationsDtoUserBreathingExercisesItem.chest_opening_breaths,
  },
  {
    get label() {
      return i18n.t('admin_inf_abdominal_breathing');
    },
    value: ScheduleMobilityLimitationsDtoUserBreathingExercisesItem.abdominal_breathing,
  },
];

export const withoutLimitationsBreathingExercisesOptions = [
  {
    get label() {
      return i18n.t('admin_inf_chest_expansion_breathing');
    },
    value: ScheduleNoLimitationsDtoUserBreathingExercisesItem.chest_expansion_breathing,
  },
  {
    get label() {
      return i18n.t('admin_inf_chest_opening_breaths');
    },
    value: ScheduleNoLimitationsDtoUserBreathingExercisesItem.chest_opening_breaths,
  },
  {
    get label() {
      return i18n.t('admin_inf_abdominal_breathing');
    },
    value: ScheduleNoLimitationsDtoUserBreathingExercisesItem.abdominal_breathing,
  },
];

export const cognitiveGamesOptions = [
  {
    label: GAME_NAME.Sudoku,
    value: AddGameScoreDtoGameName.sudoku,
    disabled: true,
  },
  {
    label: GAME_NAME.TicTacToe,
    value: AddGameScoreDtoGameName.tic_tac_toe,
    disabled: true,
  },
  {
    label: GAME_NAME.Snake,
    value: AddGameScoreDtoGameName.snake,
    disabled: true,
  },
  {
    label: GAME_NAME[2048],
    value: AddGameScoreDtoGameName.game_2048,
    disabled: true,
  },
  {
    label: GAME_NAME.Memory,
    value: AddGameScoreDtoGameName.memory,
    disabled: true,
  },
  {
    label: GAME_NAME.Wordle,
    value: AddGameScoreDtoGameName.wordle,
    disabled: true,
  },
  {
    label: GAME_NAME.WordGuess,
    value: AddGameScoreDtoGameName.word_guess,
    disabled: true,
  },
];

export const limitationsPhysicalLevelOptions = [
  {
    get label() {
      return i18n.t('admin_title_light_activities');
    },
    value: GenerateSchedulesDtoRecommendedLevel.light,
    get description() {
      return i18n.t('admin_inf_time_per_week_and_repetition_of_each_exercise', {
        frequencyPerWeek:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.mobility_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.light
          ].physicalActivities.frequencyPerWeek,
        frequencyRepetition:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.mobility_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.light
          ].physicalActivities.frequencyRepetition,
      });
    },
  },
  {
    get label() {
      return i18n.t('admin_title_moderate_activities');
    },
    value: GenerateSchedulesDtoRecommendedLevel.moderate,
    get description() {
      return i18n.t('admin_inf_time_per_week_and_repetition_of_each_exercise', {
        frequencyPerWeek:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.mobility_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.moderate
          ].physicalActivities.frequencyPerWeek,
        frequencyRepetition:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.mobility_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.moderate
          ].physicalActivities.frequencyRepetition,
      });
    },
  },
  {
    get label() {
      return i18n.t('admin_title_intense_activities');
    },
    value: GenerateSchedulesDtoRecommendedLevel.intense,
    get description() {
      return i18n.t('admin_inf_time_per_week_and_repetition_of_each_exercise', {
        frequencyPerWeek:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.mobility_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.intense
          ].physicalActivities.frequencyPerWeek,
        frequencyRepetition:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.mobility_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.intense
          ].physicalActivities.frequencyRepetition,
      });
    },
  },
];

export const bedriddenPhysicalLevelOptions = [
  {
    get label() {
      return i18n.t('admin_title_light_activities');
    },
    value: GenerateSchedulesDtoRecommendedLevel.light,
    get description() {
      return i18n.t('admin_inf_time_per_day_and_repetition_of_each_exercise', {
        frequencyPerDay:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.bedridden_activities][
            GenerateSchedulesDtoRecommendedLevel.light
          ].physicalActivities.frequencyPerDay,
        frequencyRepetition:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.bedridden_activities][
            GenerateSchedulesDtoRecommendedLevel.light
          ].physicalActivities.frequencyRepetition,
      });
    },
  },
  {
    get label() {
      return i18n.t('admin_title_moderate_activities');
    },
    value: GenerateSchedulesDtoRecommendedLevel.moderate,
    get description() {
      return i18n.t('admin_inf_time_per_day_and_repetition_of_each_exercise', {
        frequencyPerDay:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.bedridden_activities][
            GenerateSchedulesDtoRecommendedLevel.moderate
          ].physicalActivities.frequencyPerDay,
        frequencyRepetition:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.bedridden_activities][
            GenerateSchedulesDtoRecommendedLevel.moderate
          ].physicalActivities.frequencyRepetition,
      });
    },
  },
  {
    get label() {
      return i18n.t('admin_title_intense_activities');
    },
    value: GenerateSchedulesDtoRecommendedLevel.intense,
    get description() {
      return i18n.t('admin_inf_time_per_day_and_repetition_of_each_exercise', {
        frequencyPerDay:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.bedridden_activities][
            GenerateSchedulesDtoRecommendedLevel.intense
          ].physicalActivities.frequencyPerDay,
        frequencyRepetition:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.bedridden_activities][
            GenerateSchedulesDtoRecommendedLevel.intense
          ].physicalActivities.frequencyRepetition,
      });
    },
  },
];

export const withoutLimitationsBreathingLevelOptions = [
  {
    get label() {
      return i18n.t('admin_title_light_activities');
    },
    value: GenerateSchedulesDtoRecommendedLevel.light,
    get description() {
      return i18n.t('admin_inf_time_per_week_and_repetition_of_each_exercise', {
        frequencyPerWeek:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.without_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.light
          ].breathingExercises.frequencyPerWeek,
        frequencyRepetition:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.without_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.light
          ].breathingExercises.frequencyRepetition,
      });
    },
  },
  {
    get label() {
      return i18n.t('admin_title_moderate_activities');
    },
    value: GenerateSchedulesDtoRecommendedLevel.moderate,
    get description() {
      return i18n.t('admin_inf_time_per_week_and_repetition_of_each_exercise', {
        frequencyPerWeek:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.without_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.moderate
          ].breathingExercises.frequencyPerWeek,
        frequencyRepetition:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.without_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.moderate
          ].breathingExercises.frequencyRepetition,
      });
    },
  },
  {
    get label() {
      return i18n.t('admin_title_intense_activities');
    },
    value: GenerateSchedulesDtoRecommendedLevel.intense,
    get description() {
      return i18n.t('admin_inf_time_per_week_and_repetition_of_each_exercise', {
        frequencyPerWeek:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.without_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.intense
          ].breathingExercises.frequencyPerWeek,
        frequencyRepetition:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.without_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.intense
          ].breathingExercises.frequencyRepetition,
      });
    },
  },
];

export const limitationsBreathingLevelOptions = [
  {
    get label() {
      return i18n.t('admin_title_light_activities');
    },
    value: GenerateSchedulesDtoRecommendedLevel.light,
    get description() {
      return i18n.t('admin_inf_time_per_week_and_repetition_of_each_exercise', {
        frequencyPerWeek:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.mobility_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.light
          ].breathingExercises.frequencyPerWeek,
        frequencyRepetition:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.mobility_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.light
          ].breathingExercises.frequencyRepetition,
      });
    },
  },
  {
    get label() {
      return i18n.t('admin_title_moderate_activities');
    },
    value: GenerateSchedulesDtoRecommendedLevel.moderate,
    get description() {
      return i18n.t('admin_inf_time_per_week_and_repetition_of_each_exercise', {
        frequencyPerWeek:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.mobility_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.moderate
          ].breathingExercises.frequencyPerWeek,
        frequencyRepetition:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.mobility_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.moderate
          ].breathingExercises.frequencyRepetition,
      });
    },
  },
  {
    get label() {
      return i18n.t('admin_title_intense_activities');
    },
    value: GenerateSchedulesDtoRecommendedLevel.intense,
    get description() {
      return i18n.t('admin_inf_time_per_week_and_repetition_of_each_exercise', {
        frequencyPerWeek:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.mobility_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.intense
          ].breathingExercises.frequencyPerWeek,
        frequencyRepetition:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.mobility_limitation_activities][
            GenerateSchedulesDtoRecommendedLevel.intense
          ].breathingExercises.frequencyRepetition,
      });
    },
  },
];

export const bedriddenBreathingLevelOptions = [
  {
    get label() {
      return i18n.t('admin_title_light_activities');
    },
    value: GenerateSchedulesDtoRecommendedLevel.light,
    get description() {
      return i18n.t('admin_inf_time_per_day_and_repetition_of_each_exercise', {
        frequencyPerDay:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.bedridden_activities][
            GenerateSchedulesDtoRecommendedLevel.light
          ].breathingExercises.frequencyPerDay,
        frequencyRepetition:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.bedridden_activities][
            GenerateSchedulesDtoRecommendedLevel.light
          ].breathingExercises.frequencyRepetition,
      });
    },
  },
  {
    get label() {
      return i18n.t('admin_title_moderate_activities');
    },
    value: GenerateSchedulesDtoRecommendedLevel.moderate,
    get description() {
      return i18n.t('admin_inf_time_per_day_and_repetition_of_each_exercise', {
        frequencyPerDay:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.bedridden_activities][
            GenerateSchedulesDtoRecommendedLevel.moderate
          ].breathingExercises.frequencyPerDay,
        frequencyRepetition:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.bedridden_activities][
            GenerateSchedulesDtoRecommendedLevel.moderate
          ].breathingExercises.frequencyRepetition,
      });
    },
  },
  {
    get label() {
      return i18n.t('admin_title_intense_activities');
    },
    value: GenerateSchedulesDtoRecommendedLevel.intense,
    get description() {
      return i18n.t('admin_inf_time_per_day_and_repetition_of_each_exercise', {
        frequencyPerDay:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.bedridden_activities][
            GenerateSchedulesDtoRecommendedLevel.intense
          ].breathingExercises.frequencyPerDay,
        frequencyRepetition:
          activitiesModalConfig[GenerateSchedulesDtoUserMobility.bedridden_activities][
            GenerateSchedulesDtoRecommendedLevel.intense
          ].breathingExercises.frequencyRepetition,
      });
    },
  },
];

export const withoutLimitationsPhysicalLevelOptions = (
  recommendedType: GetUserMobilityLevelRecommendedLevel
) => [
  {
    label: i18n.t('admin_title_light_activities'),
    value: ScheduleNoLimitationsDtoPhysicalLevel.light,
    description: i18n.t('admin_inf_time_per_week_and_up_to_repetition_of_each_exercise', {
      frequencyPerWeek:
        activitiesModalConfig[GenerateSchedulesDtoUserMobility.without_limitation_activities][
          ScheduleNoLimitationsDtoPhysicalLevel.light
        ].physicalActivities.frequencyPerWeek,
      frequencyRepetition:
        activitiesModalConfig[GenerateSchedulesDtoUserMobility.without_limitation_activities][
          ScheduleNoLimitationsDtoPhysicalLevel.light
        ].physicalActivities.frequencyRepetition[1],
    }),
    isRecommended: recommendedType === GetUserMobilityLevelRecommendedLevel.light ? true : false,
  },
  {
    label: i18n.t('admin_title_moderate_activities'),
    value: ScheduleNoLimitationsDtoPhysicalLevel.moderate,
    description: i18n.t('admin_inf_time_per_week_and_up_to_repetition_of_each_exercise', {
      frequencyPerWeek:
        activitiesModalConfig[GenerateSchedulesDtoUserMobility.without_limitation_activities][
          ScheduleNoLimitationsDtoPhysicalLevel.moderate
        ].physicalActivities.frequencyPerWeek,
      frequencyRepetition:
        activitiesModalConfig[GenerateSchedulesDtoUserMobility.without_limitation_activities][
          ScheduleNoLimitationsDtoPhysicalLevel.moderate
        ].physicalActivities.frequencyRepetition[1],
    }),
    isRecommended: recommendedType === GetUserMobilityLevelRecommendedLevel.moderate ? true : false,
  },
  {
    label: i18n.t('admin_title_intense_activities'),
    value: ScheduleNoLimitationsDtoPhysicalLevel.intense,
    description: i18n.t('admin_inf_time_per_week_and_up_to_repetition_of_each_exercise', {
      frequencyPerWeek:
        activitiesModalConfig[GenerateSchedulesDtoUserMobility.without_limitation_activities][
          ScheduleNoLimitationsDtoPhysicalLevel.intense
        ].physicalActivities.frequencyPerWeek,
      frequencyRepetition:
        activitiesModalConfig[GenerateSchedulesDtoUserMobility.without_limitation_activities][
          ScheduleNoLimitationsDtoPhysicalLevel.intense
        ].physicalActivities.frequencyRepetition[1],
    }),
    isRecommended: recommendedType === GetUserMobilityLevelRecommendedLevel.intense ? true : false,
  },
];

export const activitiesLevel: Record<GenerateSchedulesDtoRecommendedLevel, string> = {
  get [GenerateSchedulesDtoRecommendedLevel.light]() {
    return i18n.t('admin_title_light_activities');
  },
  get [GenerateSchedulesDtoRecommendedLevel.moderate]() {
    return i18n.t('admin_title_moderate_activities');
  },
  get [GenerateSchedulesDtoRecommendedLevel.intense]() {
    return i18n.t('admin_title_intense_activities');
  },
};

export const lowerRepetitionExercises = [
  GeneratedSingleScheduleDtoPhysicalActivitiesItem.standing_on_toes,
  GeneratedSingleScheduleDtoPhysicalActivitiesItem.leaning_the_body_forward,
];

export const reasonOfUpdateCarePlanOptions = [
  {
    get label() {
      return i18n.t('admin_inf_senior_does_not_like_assigned_activities');
    },
    value: EditCarePlanReasonDtoEditCarePlanReason.senior_does_not_like_assigned_activities,
  },
  {
    get label() {
      return i18n.t('admin_inf_intensity_level_is_not_correct');
    },
    value: EditCarePlanReasonDtoEditCarePlanReason.intensity_level_is_not_correct,
  },
  {
    get label() {
      return i18n.t('admin_inf_seniors_condition_has_changed');
    },
    value: EditCarePlanReasonDtoEditCarePlanReason.seniors_condition_has_changed,
  },
  {
    get label() {
      return i18n.t('admin_inf_other');
    },
    value: EditCarePlanReasonDtoEditCarePlanReason.other,
  },
];

export const withoutLimitationsGrowthChallengesOptions = [
  {
    get label() {
      return i18n.t('admin_inf_not_assigned');
    },
    value: PersonalGrowth.NotAssigned,
    get description() {
      return i18n.t('admin_inf_not_have_personal_growth_in_care_plan');
    },
    descriptionPosition: 'bottom',
  },
  {
    get label() {
      return i18n.t('admin_title_connect_with_youths');
    },
    value: ScheduleNoLimitationsDtoPersonalGrowth.connect_with_youths,
    get description() {
      return i18n.t('admin_title_connect_with_grandchild_or_another_youths');
    },
    descriptionPosition: 'bottom',
  },
  {
    get label() {
      return i18n.t('admin_title_connect_with_person_your_age');
    },
    value: ScheduleNoLimitationsDtoPersonalGrowth.connect_with_peer,
    get description() {
      return i18n.t('admin_title_explore_weekly_tasks_with_someone_your_age');
    },
    descriptionPosition: 'bottom',
  },
];

export const mobilityLimitationsGrowthChallengesOptions = [
  {
    get label() {
      return i18n.t('admin_inf_not_assigned');
    },
    value: PersonalGrowth.NotAssigned,
    get description() {
      return i18n.t('admin_inf_not_have_personal_growth_in_care_plan');
    },
    descriptionPosition: 'bottom',
  },
  {
    get label() {
      return i18n.t('admin_title_connect_with_youths');
    },
    value: ScheduleMobilityLimitationsDtoPersonalGrowth.connect_with_youths,
    get description() {
      return i18n.t('admin_title_connect_with_grandchild_or_another_youths');
    },
    descriptionPosition: 'bottom',
  },
  {
    get label() {
      return i18n.t('admin_title_connect_with_person_your_age');
    },
    value: ScheduleMobilityLimitationsDtoPersonalGrowth.connect_with_peer,
    get description() {
      return i18n.t('admin_title_explore_weekly_tasks_with_someone_your_age');
    },
    descriptionPosition: 'bottom',
  },
];

export const bedriddenGrowthChallengesOptions = [
  {
    get label() {
      return i18n.t('admin_inf_not_assigned');
    },
    value: PersonalGrowth.NotAssigned,
    get description() {
      return i18n.t('admin_inf_not_have_personal_growth_in_care_plan');
    },
    descriptionPosition: 'bottom',
  },
  {
    get label() {
      return i18n.t('admin_title_connect_with_youths');
    },
    value: ScheduleBedriddenDtoPersonalGrowth.connect_with_youths,
    get description() {
      return i18n.t('admin_title_connect_with_grandchild_or_another_youths');
    },
    descriptionPosition: 'bottom',
  },
  {
    get label() {
      return i18n.t('admin_title_connect_with_person_your_age');
    },
    value: ScheduleBedriddenDtoPersonalGrowth.connect_with_peer,
    get description() {
      return i18n.t('admin_title_explore_weekly_tasks_with_someone_your_age');
    },
    descriptionPosition: 'bottom',
  },
];

export const customScreenBreakpointM = '1200px';
export const customScreenBreakpoint = '1300px';
export const customScreenBreakpointL = '1400px';
export const customScreenBreakpointXL = '1500px';

export const statusValueToDisplay = {
  [StatusStatusName.active]: 'admin_form_status_active',
  [StatusStatusName.inactive]: 'admin_form_status_inactive',
  [StatusStatusName.created]: 'admin_form_status_created',
};
