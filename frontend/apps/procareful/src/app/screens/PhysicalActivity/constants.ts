import {
  GeneratedSingleScheduleDtoBreathingExercisesItem,
  GeneratedSingleScheduleDtoPhysicalActivitiesItem,
  ScheduleNoLimitationsDtoUserPhysicalExercisesItem,
  UpdateUserPhysicalActivitiesScoresDtoTimeOfDay,
  UserControllerGetUserActivitiesListExerciseType,
} from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { ProcarefulAppPathRoutes } from '@Procareful/common/lib';

export const physicalExercisesName = {
  // no limitations
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.standing_on_toes]() {
    return i18n.t('admin_inf_standing_on_toes');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.lifting_leg_forwards]() {
    return i18n.t('admin_inf_lifting_the_leg_forwards');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.lifting_leg_backwards]() {
    return i18n.t('admin_inf_lifting_leg_backwards');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.lifting_leg_to_the_side]() {
    return i18n.t('admin_inf_lifting_leg_on_the_side');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.bending_knee_lifting_leg_and_touching_it_with_opposite_hand]() {
    return i18n.t('admin_inf_bending_knee_lifting_leg_and_touching_it_with_opposite_hand');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.leaning_the_body_forward]() {
    return i18n.t('admin_inf_leaning_your_body_forward');
  },
  // limitations
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.lifting_of_the_feet_sitting]() {
    return i18n.t('admin_inf_lifting_of_the_feet');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.lifting_the_heels]() {
    return i18n.t('admin_inf_lifting_the_heels');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.alternate_step_with_toe_or_heel]() {
    return i18n.t('admin_inf_alternate_step_with_toe_or_heel');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.leg_opening_and_closing_exercise_with_toe_or_heel_support]() {
    return i18n.t('admin_inf_leg_opening_and_closing_exercise_with_toe_or_heel_support');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.skipping_exercise]() {
    return i18n.t('admin_inf_skipping_exercise');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.rotating_legs]() {
    return i18n.t('admin_inf_rotating_legs');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.shoulder_circles]() {
    return i18n.t('admin_inf_shoulder_circles');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.alternating_arm_reaches]() {
    return i18n.t('admin_inf_alternating_arm_reaches');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.spine_twist_with_bent_arm]() {
    return i18n.t('admin_inf_spine_twist_with_bent_arm');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.alternating_arm_lifts]() {
    return i18n.t('admin_inf_alternating_arm_lifts');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.arm_circles]() {
    return i18n.t('admin_inf_arm_circles');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.side_bend]() {
    return i18n.t('admin_inf_side_bend');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.spine_twist_with_extended_arm]() {
    return i18n.t('admin_inf_spine_twist_with_extended_arm');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.hip_abduction]() {
    return i18n.t('admin_inf_hip_abduction');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.opposite_arm_and_leg_lift]() {
    return i18n.t('admin_inf_opposite_arm_and_leg_lift');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.sit_to_stand_with_arm_reach]() {
    return i18n.t('admin_inf_sit_to_stand_with_arm_reach');
  },
  // bedridden
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.exercise_for_feet]() {
    return i18n.t('admin_inf_exercise_for_feet');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.bending_a_leg]() {
    return i18n.t('admin_inf_bending_a_leg');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.lifting_of_the_hips]() {
    return i18n.t('admin_inf_lifting_of_the_hips');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.knee_exercise_with_a_ball]() {
    return i18n.t('admin_inf_knee_exercise_with_a_ball');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.opening_a_book_knee_exercise]() {
    return i18n.t('admin_inf_opening_a_book_knee_exercise');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.touching_knee_with_an_opposite_hand]() {
    return i18n.t('admin_inf_touching_knee_with_an_opposite_hand');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.lifting_arms_above_your_head]() {
    return i18n.t('admin_inf_lifting_arms_above_your_head');
  },
  get [GeneratedSingleScheduleDtoPhysicalActivitiesItem.hip_flexibility_exercise]() {
    return i18n.t('admin_inf_hip_flexibility_exercise');
  },
  get [ScheduleNoLimitationsDtoUserPhysicalExercisesItem.lifting_leg]() {
    return i18n.t('admin_inf_lifting_leg_with_each_type');
  },
  // breathing
  get [GeneratedSingleScheduleDtoBreathingExercisesItem.breathing_with_the_prefix]() {
    return i18n.t('admin_inf_breathing_with_the_prefix');
  },
  get [GeneratedSingleScheduleDtoBreathingExercisesItem.lifting_the_elbow_away_from_the_body]() {
    return i18n.t('admin_inf_lifting_the_elbows_away');
  },
  get [GeneratedSingleScheduleDtoBreathingExercisesItem.blowing_newspaper_strips_on_the_trapeze]() {
    return i18n.t('admin_inf_blowing_newspaper_strips');
  },
  get [GeneratedSingleScheduleDtoBreathingExercisesItem.blowing_the_whistle]() {
    return i18n.t('admin_inf_blowing_the_whistle');
  },
  get [GeneratedSingleScheduleDtoBreathingExercisesItem.blowing_ping_pong_balls]() {
    return i18n.t('admin_inf_blowing_ping_pong_balls');
  },
  get [GeneratedSingleScheduleDtoBreathingExercisesItem.blowing_soap_bubbles]() {
    return i18n.t('admin_inf_blowing_soap_bubbles');
  },
  get [GeneratedSingleScheduleDtoBreathingExercisesItem.chest_expansion_breathing]() {
    return i18n.t('admin_inf_chest_expansion_breathing');
  },
  get [GeneratedSingleScheduleDtoBreathingExercisesItem.chest_opening_breaths]() {
    return i18n.t('admin_inf_chest_opening_breaths');
  },
  get [GeneratedSingleScheduleDtoBreathingExercisesItem.abdominal_breathing]() {
    return i18n.t('admin_inf_abdominal_breathing');
  },
};

export const exerciseTypeByRoute = {
  [ProcarefulAppPathRoutes.PhysicalActivitiesBreathing]:
    UserControllerGetUserActivitiesListExerciseType.breathingExercises,
  [ProcarefulAppPathRoutes.PhysicalActivitiesDawnDeepBreaths]:
    UserControllerGetUserActivitiesListExerciseType.breathingExercisesMorning,
  [ProcarefulAppPathRoutes.PhysicalActivitiesTwilightBreaths]:
    UserControllerGetUserActivitiesListExerciseType.breathingExercisesMidDay,
  [ProcarefulAppPathRoutes.PhysicalActivitiesExercises]:
    UserControllerGetUserActivitiesListExerciseType.physicalExercises,
  [ProcarefulAppPathRoutes.PhysicalActivitiesStartYourDay]:
    UserControllerGetUserActivitiesListExerciseType.physicalExercisesMorning,
  [ProcarefulAppPathRoutes.PhysicalActivitiesStayActive]:
    UserControllerGetUserActivitiesListExerciseType.physicalExercisesMidDay,
  [ProcarefulAppPathRoutes.PhysicalActivitiesWalking]:
    UserControllerGetUserActivitiesListExerciseType.walkingExercises,
};

export const activityDayTimeByRoute = {
  [ProcarefulAppPathRoutes.PhysicalActivitiesBreathing]: undefined,
  [ProcarefulAppPathRoutes.PhysicalActivitiesDawnDeepBreaths]:
    UpdateUserPhysicalActivitiesScoresDtoTimeOfDay.morning,
  [ProcarefulAppPathRoutes.PhysicalActivitiesTwilightBreaths]:
    UpdateUserPhysicalActivitiesScoresDtoTimeOfDay.mid_day,
  [ProcarefulAppPathRoutes.PhysicalActivitiesExercises]: undefined,
  [ProcarefulAppPathRoutes.PhysicalActivitiesStartYourDay]:
    UpdateUserPhysicalActivitiesScoresDtoTimeOfDay.morning,
  [ProcarefulAppPathRoutes.PhysicalActivitiesStayActive]:
    UpdateUserPhysicalActivitiesScoresDtoTimeOfDay.mid_day,
  [ProcarefulAppPathRoutes.PhysicalActivitiesWalking]: undefined,
};
