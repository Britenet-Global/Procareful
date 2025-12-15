import {
  EBreathingExercisePosition,
  EBreathingExerciseType,
  EPhysicalExercisePosition,
  EPhysicalExercises,
  EUserPhysicalActivityGroup,
  EActivityLevel,
  EWalkingLevel,
} from '../../admin/caregiver/types';

export type TUserCompletedActivities = {
  activities: { name: string; completed: boolean }[];
  totalActivities: number;
  completedActivities: number;
};
export enum EPersonalRate {
  VERY_DISSATISFIED = 'very_dissatisfied',
  DISSATISFIED = 'dissatisfied',
  NEUTRAL = 'neutral',
  SATISFIED = 'satisfied',
  VERY_SATISFIED = 'very_satisfied',
}

export enum EDifficultyFeedback {
  FELT_OVERWHELMED = 'felt_overwhelmed',
  TOO_CHALLENGING = 'too_challenging',
  WISH_DIFFICULTY_INCREASE_GRADUAL = 'wish_difficulty_increase_gradual',
  LESS_ENJOYABLE = 'less_enjoyable',
  OTHER = 'other',
}

export enum EGameExperienceFeedback {
  FOUND_BUG_OR_ISSUE = 'found_bug_or_issue',
  DID_NOT_UNDERSTAND_OBJECTIVE = 'did_not_understand_objective',
  CONFUSING_CONTROLS = 'confusing_controls',
  TOO_CHALLENGING = 'too_challenging',
  PREFER_OTHER_GAMES = 'prefer_other_games',
  OTHER = 'other',
}

export enum EFeedbackType {
  INCREASED_DIFFICULTY_LEVEL = 'increased_difficulty_level',
  SECOND_LOSS_IN_A_GAME = 'second_loss_in_a_game',
  CLOSING_GAME_BEFORE_COMPLETION = 'closing_game_before_completion',
}

export type CompletedPhysicalExercise = {
  name: EPhysicalExercises;
  completed: boolean;
};

export type CompletedBreathingExercise = {
  name: EBreathingExerciseType;
  completed: boolean;
};

export type CompletedWalkingExercise = {
  time: number;
  completed: boolean;
};

export type TUserSchedule = {
  games: { completed: boolean };
  physicalExercises?: CompletedPhysicalExercise[];
  breathingExercises?: CompletedBreathingExercise[];
  physicalExercisesMorning?: CompletedPhysicalExercise[];
  physicalExercisesMidDay?: CompletedPhysicalExercise[];
  breathingExercisesMorning?: CompletedBreathingExercise[];
  breathingExercisesMidDay?: CompletedBreathingExercise[];
  walkingExercises?: CompletedWalkingExercise;
  personalGrowth?: {
    id?: number;
    title?: string;
    description?: string;
    completed?: boolean;
    allPersonalGrowthChallengesCompleted: boolean;
  };
};

export type TUserDashboard = {
  firstName: string;
  schedule: TUserSchedule;
  dailyProgress: number;
  completedTasks: number;
  totalTasks: number;
  userActivitiesGroup: EUserPhysicalActivityGroup;
};

export enum EUserExerciseTypes {
  PHYSICAL_EXERCISES = 'physicalExercises',
  PHYSICAL_EXERCISES_MORNING = 'physicalExercisesMorning',
  PHYSICAL_EXERCISES_MID_DAY = 'physicalExercisesMidDay',
  BREATHING_EXERCISES = 'breathingExercises',
  BREATHING_EXERCISES_MORNING = 'breathingExercisesMorning',
  BREATHING_EXERCISES_MID_DAY = 'breathingExercisesMidDay',
  WALKING_EXERCISES = 'walkingExercises',
}

export type TExerciseProps = {
  name: string;
  completed: boolean;
};

export type TGetUserActivitiesListWalkingResponse = {
  walking: TExerciseProps[];
};

export type TGetUserActivitiesListPhysicalResponse = {
  exercise_in_bed?: TExerciseProps[];
  sitting_lower_body?: TExerciseProps[];
  sitting_upper_body?: TExerciseProps[];
  sitting_balance_and_coordination?: TExerciseProps[];
  fall_prevention?: TExerciseProps[];
};

export type TGetUserActivitiesListBreathingResponse = {
  exercise_in_bed?: TExerciseProps[];
  exercise_sitting?: TExerciseProps[];
};

export type TGetUserActivitiesListGenerateResponse = {
  [key in EPhysicalExercisePosition | EBreathingExercisePosition]?: { name: string; completed: boolean }[];
};

export type TGetLang = {
  details: {
    language: string;
  };
};

export type TUserAssignedCarePlanHistory = {
  number_of_physical_exercises: number;
  number_of_breathing_activities: number;
  walking_exercise: boolean;
  personal_growth: boolean;
  physical_activities_intensity: EActivityLevel;
  breathing_activities_intensity: EActivityLevel;
  walking_level: EWalkingLevel | null;
  activity_group: EUserPhysicalActivityGroup;
  user: {
    id: number;
  };
};
