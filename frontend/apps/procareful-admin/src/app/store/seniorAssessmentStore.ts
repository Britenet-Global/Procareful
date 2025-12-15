import { type Dayjs } from 'dayjs';
import { type z } from 'zod';
import { create } from 'zustand';
import { type UploadFile } from 'antd';
import type {
  physicalAbilitiesSchema,
  cognitiveAbilitiesSchema,
  physicalAbilitiesNoIssuesSchema,
  socialAbilitiesSchema,
  qualityOfLifeSchema,
  sleepAssessmentSchema,
  additionalInfoSchema,
} from '@ProcarefulAdmin/utils';
import type {
  AddQualityOfLifeDtoAnxietyDepression,
  AddQualityOfLifeDtoMobility,
  AddQualityOfLifeDtoMotivation,
  AddQualityOfLifeDtoPainDiscomfort,
  AddQualityOfLifeDtoSelfCare,
  AddQualityOfLifeDtoUsualActivities,
  AddSleepAssessmentDto,
  AddSocialAbilitiesDtoEnoughPeopleFeelClose,
  AddSocialAbilitiesDtoExperienceOfEmptiness,
  AddSocialAbilitiesDtoFeelRejected,
  AddSocialAbilitiesDtoMissHavingPeopleAround,
  AddSocialAbilitiesDtoRelyOnPeople,
  AddSocialAbilitiesDtoTrustCompletely,
  CaregiverControllerAddAdditionalInfoBody,
} from '@Procareful/common/api';

export type CognitiveAbilitiesData = z.infer<typeof cognitiveAbilitiesSchema>;
export type PhysicalActivityLevelData = z.infer<typeof physicalAbilitiesSchema>;
export type NoPhysicalIssuesData = z.infer<typeof physicalAbilitiesNoIssuesSchema>;
export type SocialAbilitiesData = z.infer<typeof socialAbilitiesSchema>;
export type QualityOfLifeData = z.infer<typeof qualityOfLifeSchema>;
export type SleepAssessmentData = z.infer<typeof sleepAssessmentSchema>;
export type AdditionalInfoData = z.infer<typeof additionalInfoSchema>;

export type SeniorAssessmentData = CognitiveAbilitiesData &
  PhysicalActivityLevelData &
  NoPhysicalIssuesData &
  SocialAbilitiesData &
  QualityOfLifeData &
  SleepAssessmentData &
  AdditionalInfoData;

type SeniorAssessmentStore = {
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  showExtendedPhysicalActivityForm?: boolean;
  formDetails: {
    // cognitive abilities
    mocaScoring?: number;
    // physical abilities
    currentlyBedridden?: boolean;
    canWalkWithoutSupport?: boolean;
    severeBalanceProblems?: boolean;
    vigorousActivityDaysLastWeek?: number;
    vigorousActivityMinutesPerDay?: number;
    moderateActivityDaysLastWeek?: number;
    moderateActivityMinutesPerDay?: number;
    walkingDaysLastWeek?: number;
    walkingMinutesPerDay?: number;
    timeSittingLastWeek?: number;
    vigorousActivityMinutesPerDayNotSure?: boolean;
    moderateActivityMinutesPerDayNotSure?: boolean;
    walkingMinutesPerDayNotSure?: boolean;
    timeSittingLastWeekNotSure?: boolean;

    // social activities
    experienceOfEmptiness?: AddSocialAbilitiesDtoExperienceOfEmptiness;
    missHavingPeopleAround?: AddSocialAbilitiesDtoMissHavingPeopleAround;
    feelRejected?: AddSocialAbilitiesDtoFeelRejected;
    relyOnPeople?: AddSocialAbilitiesDtoRelyOnPeople;
    trustCompletely?: AddSocialAbilitiesDtoTrustCompletely;
    enoughPeopleFeelClose?: AddSocialAbilitiesDtoEnoughPeopleFeelClose;
    // quality of life
    motivation?: AddQualityOfLifeDtoMotivation;
    mobility?: AddQualityOfLifeDtoMobility;
    selfCare?: AddQualityOfLifeDtoSelfCare;
    usualActivities?: AddQualityOfLifeDtoUsualActivities;
    painDiscomfort?: AddQualityOfLifeDtoPainDiscomfort;
    anxietyDepression?: AddQualityOfLifeDtoAnxietyDepression;
    generalHealth?: number;
    // sleep
    bedTime?: Dayjs;
    fallAsleepDuration?: AddSleepAssessmentDto['fall_asleep_duration'];
    wakeUpTime?: Dayjs;
    actualSleepHours?: AddSleepAssessmentDto['actual_sleep_hours'];
    cannotSleepWithin30Minutes?: AddSleepAssessmentDto['cannot_sleep_within_30_minutes'];
    wakeUpMidnightOrEarlyMorning?: AddSleepAssessmentDto['wake_up_midnight_or_early_morning'];
    needToUseBathroom?: AddSleepAssessmentDto['need_to_use_bathroom'];
    cannotBreatheComfortably?: AddSleepAssessmentDto['cannot_breathe_comfortably'];
    feelTooCold?: AddSleepAssessmentDto['feel_too_cold'];
    feelTooHot?: AddSleepAssessmentDto['feel_too_hot'];
    hadBadDreams?: AddSleepAssessmentDto['had_bad_dreams'];
    havePain?: AddSleepAssessmentDto['have_pain'];
    coughOrSnoreLoudly?: AddSleepAssessmentDto['cough_or_snore_loudly'];
    otherReasonsForTroubleSleeping?: AddSleepAssessmentDto['other_reasons_for_trouble_sleeping'];
    sleepingTroubleFrequency?: AddSleepAssessmentDto['sleeping_trouble_frequency'];
    sleepQualityRating?: AddSleepAssessmentDto['sleep_quality_rating'];
    medicineForSleep?: AddSleepAssessmentDto['medicine_for_sleep'];
    troubleStayingAwakeFrequency?: AddSleepAssessmentDto['trouble_staying_awake_frequency'];
    enthusiasmToGetThingsDone?: AddSleepAssessmentDto['enthusiasm_to_get_things_done'];
    haveBedPartnerOrRoomMate?: AddSleepAssessmentDto['have_bed_partner_or_room_mate'];
    loudSnoring?: AddSleepAssessmentDto['loud_snoring'];
    breathingPause?: AddSleepAssessmentDto['breathing_pause'];
    legsTwitching?: AddSleepAssessmentDto['legs_twitching'];
    sleepDisorientation?: AddSleepAssessmentDto['sleep_disorientation'];
    coughOrSnoreLoudlyRoomMate?: AddSleepAssessmentDto['cough_or_snore_loudly_room_mate'];
    feelTooColdRoomMate?: AddSleepAssessmentDto['feel_too_cold_room_mate'];
    feelTooHotRoomMate?: AddSleepAssessmentDto['feel_too_hot_room_mate'];
    hadBadDreamsRoomMate?: AddSleepAssessmentDto['had_bad_dreams_room_mate'];
    havePainRoomMate?: AddSleepAssessmentDto['have_pain_room_mate'];
    otherRestlessness?: AddSleepAssessmentDto['other_restlessness'];
    otherRestlessnessFrequency?: AddSleepAssessmentDto['trouble_sleeping_frequency_room_mate'];
    // additional info
    notes?: CaregiverControllerAddAdditionalInfoBody['notes'];
    files?: UploadFile[];
  };
  setSeniorAssessmentDetails: (formDetails: Partial<SeniorAssessmentData>) => void;
  setShowExtendedPhysicalActivityForm: (value: boolean) => void;
  resetStore: () => void;
};

const initialState = {
  currentStep: 0,
  showExtendedPhysicalActivityForm: false,
  formDetails: {
    mocaScoring: undefined,
    currentlyBedridden: undefined,
    canWalkWithoutSupport: undefined,
    severeBalanceProblems: undefined,
    vigorousActivityDaysLastWeek: undefined,
    vigorousActivityMinutesPerDay: undefined,
    moderateActivityDaysLastWeek: undefined,
    moderateActivityMinutesPerDay: undefined,
    walkingDaysLastWeek: undefined,
    walkingMinutesPerDay: undefined,
    timeSittingLastWeek: undefined,
    vigorousActivityMinutesPerDayNotSure: false,
    moderateActivityMinutesPerDayNotSure: false,
    walkingMinutesPerDayNotSure: false,
    timeSittingLastWeekNotSure: false,
    motivation: undefined,
    mobility: undefined,
    selfCare: undefined,
    usualActivities: undefined,
    painDiscomfort: undefined,
    anxietyDepression: undefined,
    generalHealth: undefined,
    bedTime: undefined,
    fallAsleepDuration: undefined,
    wakeUpTime: undefined,
    actualSleepHours: undefined,
    cannotSleepWithin30Minutes: undefined,
    wakeUpMidnightOrEarlyMorning: undefined,
    needToUseBathroom: undefined,
    cannotBreatheComfortably: undefined,
    feelTooCold: undefined,
    feelTooHot: undefined,
    hadBadDreams: undefined,
    havePain: undefined,
    coughOrSnoreLoudly: undefined,
    otherReasonsForTroubleSleeping: undefined,
    sleepingTroubleFrequency: undefined,
    medicineForSleep: undefined,
    sleepQualityRating: undefined,
    troubleStayingAwakeFrequency: undefined,
    enthusiasmToGetThingsDone: undefined,
    haveBedPartnerOrRoomMate: undefined,
    loudSnoring: undefined,
    breathingPause: undefined,
    legsTwitching: undefined,
    sleepDisorientation: undefined,
    coughOrSnoreLoudlyRoomMate: undefined,
    feelTooColdRoomMate: undefined,
    feelTooHotRoomMate: undefined,
    hadBadDreamsRoomMate: undefined,
    havePainRoomMate: undefined,
    otherRestlessness: undefined,
    otherRestlessnessFrequency: undefined,
    notes: undefined,
    files: undefined,
  },
};

export const useSeniorAssessmentStore = create<SeniorAssessmentStore>(set => ({
  ...initialState,
  goToNextStep: () => set(({ currentStep }) => ({ currentStep: currentStep + 1 })),
  goToPreviousStep: () =>
    set(({ currentStep }) => {
      const prevStep = Math.max(currentStep - 1, 0);

      return { currentStep: prevStep };
    }),
  setSeniorAssessmentDetails: data => {
    set(({ formDetails }) => ({
      formDetails: { ...formDetails, ...data },
    }));
  },
  setShowExtendedPhysicalActivityForm: showExtendedPhysicalActivityForm => {
    set({ showExtendedPhysicalActivityForm });
  },
  resetStore: () => set(initialState),
}));
