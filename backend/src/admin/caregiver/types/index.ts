import { Attachment } from '../../../notes/entities/attachment.entity';
import { NoteCategory } from '../../../notes/entities/noteCategory.entity';
import { User } from '../../../user/entities/user.entity';
import { TArrayResponse, TValidationErrorsKeys } from '../../../common/types';
import { UserContact } from '../entities/userContact.entity';
import { Address } from 'src/common/entities/address.entity';
import { TGetGamesEngagement, TSeniorsPerformance } from '../dashboards/types';
import { UserPhysicalActivities } from '../entities/userPhysicalActivities.entity';
import { UserCognitiveAbilities } from '../entities/userCognitiveAbilities.entity';
import { UserSocialAbilities } from '../entities/userSocialAbilities.entity';
import { UserQualityOfLife } from '../entities/userQualityOfLife.entity';
import { UserSleepAssessment } from '../entities/userSleepAssessment.entity';
import { UserAdditionalInfo } from '../entities/userAdditionalInfo.entity';
import { Admin } from '../../entities';

export interface UserWithImage extends User {
  image: string | null;
  assessment_completed: boolean;
  activities_assigned: boolean;
  performance_warning: boolean | null;
}

export type TCaregiverCommonTypes = {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  details: TDetails;
  caregiverRoles: ECaregiverRole[];
  conversations: TConversation[];
  notifications: TNotification[];
};

export type TDetails = {
  qualifications: string;
  experience: string;
  about: string;
};

export enum ECaregiverRole {
  SOCIAL_WORKER = 'social_worker',
  HEALTH_CARE_PROFESSIONAL = 'health_care_professional',
  CARE_WORKER = 'care_worker',
  VOLUNTEER = 'volunteer',
  PSYCHOLOGIST = 'psychologist',
  SOCIALIZATION_COORDINATOR = 'socialization_coordinator',
  INFORMAL_CAREGIVER = 'informal_caregiver',
  OTHER = 'other',
}

export type TConversation = {
  id: number;
  name: string;
  timestamp: Date;
  messageIds: number[];
  messages: TMessage[];
};

export type TMessage = {
  id: number;
  message: string;
  senderId: number;
  recieverId: number;
  timestamp: Date;
};

export type TNotification = {
  id: number;
  date: Date;
  title: string;
  priority: EPriority;
  userId: number;
};

export enum EPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

export type TFormalCaregiver = TCaregiverCommonTypes & {
  insitute: string;
  shiftSchedules: TShiftSchedule[];
  assignedUserIds: number[];

  //TODO add admin-institution type when we have admin-institution module
  // institutes: TInstitute
  trainings: TTraining[];
};

export type TShiftSchedule = {
  id: number;
  startDay: EWeekdays;
  endDay: EWeekdays;
  startTime: string;
  finalTime: string;
};

export enum EWeekdays {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

export type TTraining = {
  id: number;
  trainingName: string;
  recommendedFor: ERecommendedFor;
  noOfActivities: number;
  created: Date;
  trainingDetails: TTrainingDetails;
};

export enum ERecommendedFor {
  PASSIVE_USERS = 'Passive Users',
  INTERMEDIATE_USERS = 'Intermediate Users',
  ACTIVE_USERS = 'Active Users',
  ALL = 'All',
}

export type TTrainingDetails = {
  id: number;
  description: string;
  goals: string[];
  assignedUserIds: number[];
  schedule: TSchedule;
};

export type TSchedule = {
  id: number;
  activities: TActivity[];
  goals: string[];
};

export type TActivity = {
  id: number;
  type: EActivityType;
  date: Date;
  frequency: EActivityFrequency;
  description: string;
  duration: string;
  scores: TActivityScore[];
};

export enum EActivityType {
  GAME = 'Game',
  PHYSICAL = 'Physical',
  SOCIAL = 'Social',
}

export enum EActivityFrequency {
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
}

export type TActivityScore = {
  id: number;
  points: number;
  streak: number;
  challengesId: number;
  challenges: TActivityChallenge[];
};

export type TActivityChallenge = {
  id: number;
  month: string;
  goal: number;
  progress: number;
};

export type TInformalCaregiver = TCaregiverCommonTypes & {
  assignedUserId: number;
};
export type TAuthor = {
  id: number;
  created_at: Date;
  first_name: string;
  last_name: string;
  phone_number: string;
  email_address: string;
  date_of_birth: Date;
  deleted_at: Date;
  image_name: string;
};

export type TNote = {
  id: number;
  created_at: Date;
  updated_at: Date;
  title: string;
  note: string;
  priority: boolean;
  attachments: Attachment[];
  category: NoteCategory[];
  author: TAuthor;
};

export enum ESleepQuality {
  VERY_GOOD = 'very_good',
  FAIRLY_GOOD = 'fairly_good',
  FAIRLY_BAD = 'fairly_bad',
  VERY_BAD = 'very_bad',
}

export enum EFrequency {
  NOT_PAST_MONTH = 'not_past_month',
  LESS_THAN_ONCE = 'less_than_once',
  ONCE_OR_TWICE = 'once_or_twice',
  THREE_OR_MORE_TIMES = 'three_or_more_times',
}

export enum EEnthusiasmLevel {
  NO_PROBLEM = 'no_problem',
  VERY_SLIGHT_PROBLEM = 'very_slight_problem',
  SOMEWHAT_A_PROBLEM = 'somewhat_a_problem',
  A_VERY_BIG_PROBLEM = 'a_very_big_problem',
}

export enum EPartnerStatus {
  NO_PARTNER_OR_ROOMMATE = 'no_partner_or_roommate',
  PARTNER_IN_OTHER_ROOM = 'partner_in_other_room',
  PARTNER_SAME_ROOM_NOT_BED = 'partner_same_room_not_bed',
  PARTNER_SAME_BED = 'partner_same_bed',
}

export enum ESocialAbilitiesResponseType {
  YES = 'yes',
  MORE_OR_LESS = 'more_or_less',
  NO = 'no',
}

export enum EProblemsLevel {
  NONE = 'none',
  SLIGHT = 'slight',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  EXTREME = 'extreme',
}

export enum ESeniorFormType {
  PERSONAL_DETAILS = 'personal_details',
  HEALTH_ASSESSMENT = 'health_assessment',
}

export type TContactWithAddress = {
  contact: UserContact;
  address: Address;
};

export type PersonalDetails = {
  basicInfo: User | User[] | TValidationErrorsKeys | TArrayResponse<User>;
  supportingContacts:
    | TValidationErrorsKeys
    | TContactWithAddress[]
    | TArrayResponse<TContactWithAddress[]>
    | TContactWithAddress[][];
  familyDoctor:
    | TValidationErrorsKeys
    | TContactWithAddress[]
    | TArrayResponse<TContactWithAddress[]>
    | TContactWithAddress[][];
  userImage: string | string[] | TValidationErrorsKeys | TArrayResponse<string>;
};

export type TSocialAbilityScores = {
  social_loneliness: number;
  emotional_loneliness: number;
  social_abilities: number;
};

export type UpdateSeniorResponseErrors = {
  [key: string]: string[];
};

export enum EUserCognitiveAbilitiesGroup {
  NORMAL = 'normal',
  VERY_MILD_COGNITIVE_IMPAIRMENT = 'very_mild_cognitive_impairment',
  MODERATE_COGNITIVE_IMPAIRMENT = 'moderate_cognitive_impairment',
}

export enum EUserPhysicalActivityGroup {
  BEDRIDDEN_ACTIVITIES = 'bedridden_activities',
  MOBILITY_LIMITATION_ACTIVITIES = 'mobility_limitation_activities',
  WITHOUT_LIMITATION_ACTIVITIES = 'without_limitation_activities',
}
export enum EActivityLevel {
  INTENSE = 'intense',
  MODERATE = 'moderate',
  LIGHT = 'light',
}
export enum EUserAssessmentAreas {
  COGNITIVE_ABILITIES = 'cognitive_abilities_group',
  PHYSICAL_ACTIVITIES = 'physical_activities_level',
  SOCIAL_ABILITIES = 'social_abilities',
  QUALITY_OF_LIFE = 'quality_of_life',
  SLEEP_ASSESSMENT = 'sleep_assessment',
}

export enum EWalkingLevel {
  SAME_AS_NOW = 'same_as_now',
  PLUS_10_PERCENT = '+10%',
  PLUS_20_PERCENT = '+20%',
}

export enum EBreathingExerciseType {
  BREATHING_WITH_THE_PREFIX = 'breathing_with_the_prefix',
  LIFTING_THE_ELBOW_AWAY_FROM_THE_BODY = 'lifting_the_elbow_away_from_the_body',
  BLOWING_NEWSPAPER_STRIPS_ON_THE_TRAPEZE = 'blowing_newspaper_strips_on_the_trapeze',
  BLOWING_THE_WHISTLE = 'blowing_the_whistle',
  BLOWING_PING_PONG_BALLS = 'blowing_ping_pong_balls',
  BLOWING_SOAP_BUBBLES = 'blowing_soap_bubbles',
  CHEST_EXPANSION_BREATHING = 'chest_expansion_breathing',
  CHEST_OPENING_BREATHS = 'chest_opening_breaths',
  ABDOMINAL_BREATHING = 'abdominal_breathing',
}
export enum EBreathingExerciseBedridden {
  BREATHING_WITH_THE_PREFIX = 'breathing_with_the_prefix',
  LIFTING_THE_ELBOW_AWAY_FROM_THE_BODY = 'lifting_the_elbow_away_from_the_body',
  BLOWING_NEWSPAPER_STRIPS_ON_THE_TRAPEZE = 'blowing_newspaper_strips_on_the_trapeze',
  BLOWING_THE_WHISTLE = 'blowing_the_whistle',
  BLOWING_PING_PONG_BALLS = 'blowing_ping_pong_balls',
  BLOWING_SOAP_BUBBLES = 'blowing_soap_bubbles',
}
export enum EBreathingExerciseSitting {
  CHEST_EXPANSION_BREATHING = 'chest_expansion_breathing',
  CHEST_OPENING_BREATHS = 'chest_opening_breaths',
  ABDOMINAL_BREATHING = 'abdominal_breathing',
}

export enum EBreathingExercisePosition {
  EXERCISE_IN_BED = 'exercise_in_bed',
  EXERCISE_SITTING = 'exercise_sitting',
}

export enum EPhysicalExercisePosition {
  EXERCISE_IN_BED = 'exercise_in_bed',
  SITTING_LOWER_BODY = 'sitting_lower_body',
  SITTING_UPPER_BODY = 'sitting_upper_body',
  SITTING_BALANCE_AND_COORDINATION = 'sitting_balance_and_coordination',
  FALL_PREVENTION = 'fall_prevention',
}

export const EMergedExercisePosition = {
  ...EBreathingExercisePosition,
  ...EPhysicalExercisePosition,
};

export type EMergedExercisePosition = EBreathingExercisePosition | EPhysicalExercisePosition;

export enum EPhysicalExercisesBedridden {
  EXERCISE_FOR_FEET = 'exercise_for_feet',
  BENDING_A_LEG = 'bending_a_leg',
  LIFTING_THE_HEELS = 'lifting_the_heels',
  LIFTING_OF_THE_HIPS = 'lifting_of_the_hips',
  KNEE_EXERCISE_WITH_A_BALL = 'knee_exercise_with_a_ball',
  OPENING_A_BOOK_KNEE_EXERCISE = 'opening_a_book_knee_exercise',
  TOUCHING_KNEE_WITH_AN_OPPOSITE_HAND = 'touching_knee_with_an_opposite_hand',
  LIFTING_ARMS_ABOVE_YOUR_HEAD = 'lifting_arms_above_your_head',
  HIP_FLEXIBILITY_EXERCISE = 'hip_flexibility_exercise',
}

export enum EPhysicalExercisesMobilityLimitations {
  LIFTING_OF_THE_FEET_SITTING = 'lifting_of_the_feet_sitting',
  ALTERNATE_STEP_WITH_TOE_OR_HEEL = 'alternate_step_with_toe_or_heel',
  LEG_OPENING_AND_CLOSING_EXERCISE_WITH_TOE_OR_HEEL_SUPPORT = 'leg_opening_and_closing_exercise_with_toe_or_heel_support',
  SKIPPING_EXERCISE = 'skipping_exercise',
  ROTATING_LEGS = 'rotating_legs',
  SHOULDER_CIRCLES = 'shoulder_circles',
  ALTERNATING_ARM_REACHES = 'alternating_arm_reaches',
  SPINE_TWIST_WITH_BENT_ARM = 'spine_twist_with_bent_arm',
  ALTERNATING_ARM_LIFTS = 'alternating_arm_lifts',
  ARM_CIRCLES = 'arm_circles',
  SIDE_BEND = 'side_bend',
  SPINE_TWIST_WITH_EXTENDED_ARM = 'spine_twist_with_extended_arm',
  HIP_ABDUCTION = 'hip_abduction',
  OPPOSITE_ARM_AND_LEG_LIFT = 'opposite_arm_and_leg_lift',
  SIT_TO_STAND_WITH_ARM_REACH = 'sit_to_stand_with_arm_reach',
}

export enum EPhysicalExercisesNoMobilityLimitations {
  STANDING_ON_TOES = 'standing_on_toes',
  LIFTING_LEG_FORWARDS = 'lifting_leg_forwards',
  LIFTING_LEG_BACKWARDS = 'lifting_leg_backwards',
  LIFTING_LEG_TO_THE_SIDE = 'lifting_leg_to_the_side',
  BENDING_KNEE_LIFTING_LEG_AND_TOUCHING_IT_WITH_OPPOSITE_HAND = 'bending_knee_lifting_leg_and_touching_it_with_opposite_hand',
  LEANING_THE_BODY_FORWARD = 'leaning_the_body_forward',
}

export enum EPhysicalExercisesNoMobilityLimitationsCondensed {
  STANDING_ON_TOES = 'standing_on_toes',
  LIFTING_LEG = 'lifting_leg',
  BENDING_KNEE_LIFTING_LEG_AND_TOUCHING_IT_WITH_OPPOSITE_HAND = 'bending_knee_lifting_leg_and_touching_it_with_opposite_hand',
  LEANING_THE_BODY_FORWARD = 'leaning_the_body_forward',
}

export enum EPhysicalExercises {
  EXERCISE_FOR_FEET = 'exercise_for_feet',
  BENDING_A_LEG = 'bending_a_leg',
  LIFTING_THE_HEELS = 'lifting_the_heels',
  LIFTING_OF_THE_HIPS = 'lifting_of_the_hips',
  KNEE_EXERCISE_WITH_A_BALL = 'knee_exercise_with_a_ball',
  OPENING_A_BOOK_KNEE_EXERCISE = 'opening_a_book_knee_exercise',
  TOUCHING_KNEE_WITH_AN_OPPOSITE_HAND = 'touching_knee_with_an_opposite_hand',
  LIFTING_ARMS_ABOVE_YOUR_HEAD = 'lifting_arms_above_your_head',
  HIP_FLEXIBILITY_EXERCISE = 'hip_flexibility_exercise',
  LIFTING_OF_THE_FEET_SITTING = 'lifting_of_the_feet_sitting',
  ALTERNATE_STEP_WITH_TOE_OR_HEEL = 'alternate_step_with_toe_or_heel',
  LEG_OPENING_AND_CLOSING_EXERCISE_WITH_TOE_OR_HEEL_SUPPORT = 'leg_opening_and_closing_exercise_with_toe_or_heel_support',
  SKIPPING_EXERCISE = 'skipping_exercise',
  ROTATING_LEGS = 'rotating_legs',
  SHOULDER_CIRCLES = 'shoulder_circles',
  ALTERNATING_ARM_REACHES = 'alternating_arm_reaches',
  SPINE_TWIST_WITH_BENT_ARM = 'spine_twist_with_bent_arm',
  ALTERNATING_ARM_LIFTS = 'alternating_arm_lifts',
  ARM_CIRCLES = 'arm_circles',
  SIDE_BEND = 'side_bend',
  SPINE_TWIST_WITH_EXTENDED_ARM = 'spine_twist_with_extended_arm',
  HIP_ABDUCTION = 'hip_abduction',
  OPPOSITE_ARM_AND_LEG_LIFT = 'opposite_arm_and_leg_lift',
  SIT_TO_STAND_WITH_ARM_REACH = 'sit_to_stand_with_arm_reach',
  STANDING_ON_TOES = 'standing_on_toes',
  LIFTING_LEG_FORWARDS = 'lifting_leg_forwards',
  LIFTING_LEG_BACKWARDS = 'lifting_leg_backwards',
  LIFTING_LEG_TO_THE_SIDE = 'lifting_leg_to_the_side',
  BENDING_KNEE_LIFTING_LEG_AND_TOUCHING_IT_WITH_OPPOSITE_HAND = 'bending_knee_lifting_leg_and_touching_it_with_opposite_hand',
  LEANING_THE_BODY_FORWARD = 'leaning_the_body_forward',
}

export type SeniorDocumentsFilesArray = {
  files: Express.Multer.File[];
};

export type TGetDocuments = {
  name: string | { name: string; unique_name: string };
  data: string | null;
  error?: string;
};

export enum EEditCarePlanReason {
  SENIOR_DOES_NOT_LIKE_ASSIGNED_ACTIVITIES = 'senior_does_not_like_assigned_activities',
  INTENSITY_LEVEL_IS_NOT_CORRECT = 'intensity_level_is_not_correct',
  SENIORS_CONDITION_HAS_CHANGED = 'seniors_condition_has_changed',
  OTHER = 'other',
}
export type TSecurityCode = {
  security_code: string;
};

export enum EWalkingExercises {
  WALKING_EXERCISE = 'walking_exercise',
}

export enum EExerciseTimeOfDay {
  MORNING = 'morning',
  MID_DAY = 'mid_day',
}

export const EMergedPhysicalExercises = {
  ...EPhysicalExercises,
  ...EBreathingExerciseType,
  ...EWalkingExercises,
};

export const EMergedPhysicalExericsesWithoutWalking = {
  ...EPhysicalExercises,
  ...EBreathingExerciseType,
};

export type EMergedPhysicalExercises = EPhysicalExercises | EBreathingExerciseType | EWalkingExercises;
export type EMergedPhysicalExericsesWithoutWalking = EPhysicalExercises | EBreathingExerciseType;

export type TPhysicalActivityCompletedPercentage = {
  physicalExercisesPercentage: number;
  breathingExercisesPercentage: number;
  walkingExercisesPercentage: number;
  overalPhysicalActivityPerformancePercentage: number;
  totalExercisesToDo: number;
  totalExercisesDone: number;
};

export type TUserProfilePerformance = {
  cognitiveGamesEngagement:
    | TGetGamesEngagement
    | TValidationErrorsKeys
    | TArrayResponse<TGetGamesEngagement>
    | TGetGamesEngagement[];
  overallEngagement:
    | TValidationErrorsKeys
    | TSeniorsPerformance
    | TArrayResponse<TSeniorsPerformance>
    | TSeniorsPerformance[];
  physicalActivityPerformance:
    | TValidationErrorsKeys
    | TPhysicalActivityCompletedPercentage
    | TArrayResponse<TPhysicalActivityCompletedPercentage>
    | TPhysicalActivityCompletedPercentage[];
};

export type TDocumentContentPayload = {
  users: User;
  user_physical_activities: UserPhysicalActivities;
  user_cognitive_abilities: UserCognitiveAbilities;
  physical_activities_group: EUserPhysicalActivityGroup;
  physical_activities_tier: EActivityLevel;
  social_abilities: number;
  quality_of_life: string;
  sleep_assessment: number;
  user_social_abilities: UserSocialAbilities;
  user_quality_of_life: UserQualityOfLife;
  user_sleep_assessment: UserSleepAssessment;
  user_additional_info: UserAdditionalInfo;
  formalCaregivers: Admin[];
  created_at: Date;
  lang: string;
};

export enum EMotivationPerformance {
  'Low' = 40,
  'Medium' = 50,
  'High' = 60,
}
