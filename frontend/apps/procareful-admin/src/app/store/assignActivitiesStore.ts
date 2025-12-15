import type { z } from 'zod';
import { create } from 'zustand';
import type { AssignChallengeType } from '@ProcarefulAdmin/pages/AssignActivities/types';
import type { ActivityType } from '@ProcarefulAdmin/typings';
import type {
  customScheduleBedriddenSchema,
  customScheduleWithLimitationsSchema,
  customScheduleWithoutLimitationsSchema,
} from '@ProcarefulAdmin/utils';
import type {
  ScheduleBedriddenDtoBreathingLevel,
  ScheduleBedriddenDtoPhysicalLevel,
  ScheduleBedriddenDtoUserBreathingExercisesItem,
  ScheduleBedriddenDtoUserPhysicalExercisesItem,
  ScheduleMobilityLimitationsDtoBreathingLevel,
  ScheduleMobilityLimitationsDtoPhysicalLevel,
  ScheduleMobilityLimitationsDtoUserBreathingExercisesItem,
  ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem,
  ScheduleNoLimitationsDtoBreathingLevel,
  ScheduleNoLimitationsDtoPhysicalLevel,
  ScheduleNoLimitationsDtoUserBreathingExercisesItem,
  ScheduleNoLimitationsDtoUserPhysicalExercisesItem,
  ScheduleNoLimitationsDtoUserWalkingExercises,
} from '@Procareful/common/api';

export type CustomScheduleWithLimitations = z.infer<typeof customScheduleWithLimitationsSchema>;
export type CustomScheduleBedridden = z.infer<typeof customScheduleBedriddenSchema>;
export type CustomScheduleWithoutLimitations = z.infer<
  typeof customScheduleWithoutLimitationsSchema
>;

type ActivityTile = {
  isVisible: boolean;
  isPicked: boolean;
};

export type CustomScheduleFormValues = {
  formValues: {
    bedriddenLimitation: {
      physicalActivities?: ScheduleBedriddenDtoUserPhysicalExercisesItem[];
      physicalActivitiesLevel?: ScheduleBedriddenDtoPhysicalLevel;
      breathingExercises?: ScheduleBedriddenDtoUserBreathingExercisesItem[];
      breathingExercisesLevel?: ScheduleBedriddenDtoBreathingLevel;
    };
    mobilityLimitation: {
      physicalExercisesLowerBody?: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem[];
      physicalExercisesUpperBody?: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem[];
      physicalExercisesBalanceAndCoordination?: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem[];
      physicalActivities?: ScheduleMobilityLimitationsDtoUserPhysicalExercisesItem[];
      physicalActivitiesLevel?: ScheduleMobilityLimitationsDtoPhysicalLevel;
      breathingExercises?: ScheduleMobilityLimitationsDtoUserBreathingExercisesItem[];
      breathingExercisesLevel?: ScheduleMobilityLimitationsDtoBreathingLevel;
    };
    withoutLimitation: {
      physicalActivities?: ScheduleNoLimitationsDtoUserPhysicalExercisesItem[];
      physicalActivitiesLevel?: ScheduleNoLimitationsDtoPhysicalLevel;
      breathingExercises?: ScheduleNoLimitationsDtoUserBreathingExercisesItem[];
      breathingExercisesLevel?: ScheduleNoLimitationsDtoBreathingLevel;
      walkingTime?: ScheduleNoLimitationsDtoUserWalkingExercises[];
    };
  };
};

type AssignActivitiesStore = {
  light: ActivityTile;
  moderate: ActivityTile;
  intense: ActivityTile;
  custom: ActivityTile & CustomScheduleFormValues;
  youths: ActivityTile;
  peer: ActivityTile;
  selectedActivity?: ActivityType;
  selectedChallenge?: AssignChallengeType;
  handleChangePickedActivity: (activityType: ActivityType) => void;
  handleChangePickedChallenge: (challengeType: AssignChallengeType) => void;
  handleSetBedriddenCustomActivities: (formData: CustomScheduleBedridden) => void;
  handleSetMobilityLimitationCustomActivities: (formData: CustomScheduleWithLimitations) => void;
  handleSetWithoutLimitationActivities: (formData: CustomScheduleWithoutLimitations) => void;
  resetStore: () => void;
};

const initialState = {
  light: {
    isVisible: true,
    isPicked: false,
  },
  moderate: {
    isVisible: true,
    isPicked: false,
  },
  intense: {
    isVisible: true,
    isPicked: false,
  },
  custom: {
    isVisible: false,
    isPicked: false,
    formValues: {
      bedriddenLimitation: {
        physicalActivities: undefined,
        physicalActivitiesLevel: undefined,
        breathingExercises: undefined,
        breathingExercisesLevel: undefined,
      },
      mobilityLimitation: {
        physicalExercisesLowerBody: undefined,
        physicalExercisesUpperBody: undefined,
        physicalExercisesBalanceAndCoordination: undefined,
        physicalActivities: undefined,
        physicalActivitiesLevel: undefined,
        breathingExercises: undefined,
        breathingExercisesLevel: undefined,
      },
      withoutLimitation: {
        physicalActivities: undefined,
        physicalActivitiesLevel: undefined,
        breathingExercises: undefined,
        breathingExercisesLevel: undefined,
        walkingTime: undefined,
      },
    },
  },
  youths: {
    isVisible: false,
    isPicked: false,
  },
  peer: {
    isVisible: false,
    isPicked: false,
  },
  selectedActivity: undefined,
  selectedChallenge: undefined,
};

export const useAssignActivitiesStore = create<AssignActivitiesStore>(set => ({
  ...initialState,
  handleChangePickedActivity: activityType => {
    set(state => ({
      light: { ...state.light, isPicked: false },
      moderate: { ...state.moderate, isPicked: false },
      intense: { ...state.intense, isPicked: false },
      custom: { ...state.custom, isPicked: false },
      [activityType]: {
        ...state[activityType],
        isPicked: !state[activityType].isPicked,
        isVisible: true,
      },
      selectedActivity: state.selectedActivity === activityType ? undefined : activityType,
    }));
  },
  handleChangePickedChallenge: challengeType => {
    set(state => ({
      peer: { ...state.peer, isPicked: false },
      youths: { ...state.youths, isPicked: false },
      [challengeType]: {
        ...initialState[challengeType],
        isPicked: !state[challengeType].isPicked,
        isVisible: true,
      },
      selectedChallenge: state.selectedChallenge === challengeType ? undefined : challengeType,
    }));
  },
  handleSetBedriddenCustomActivities: formData => {
    set(state => ({
      ...initialState,
      custom: {
        ...state.custom,
        isPicked: true,
        isVisible: true,
        formValues: {
          ...initialState.custom.formValues,
          bedriddenLimitation: {
            breathingExercises: formData.breathingExercises,
            breathingExercisesLevel: formData.breathingExercisesLevel,
            physicalActivities: formData.physicalExercisesInBed,
            physicalActivitiesLevel: formData.physicalExercisesLevel,
          },
        },
      },
      selectedActivity: 'custom',
    }));
  },
  handleSetMobilityLimitationCustomActivities: formData => {
    set(state => ({
      ...initialState,
      custom: {
        ...state.custom,
        isPicked: true,
        isVisible: true,
        formValues: {
          ...initialState.custom.formValues,
          mobilityLimitation: {
            breathingExercises: formData.breathingExercises,
            breathingExercisesLevel: formData.breathingExercisesLevel,
            physicalExercisesLowerBody: formData.physicalExercisesLowerBody,
            physicalExercisesUpperBody: formData.physicalExercisesUpperBody,
            physicalExercisesBalanceAndCoordination:
              formData.physicalExercisesBalanceAndCoordination,
            physicalActivities: [
              ...formData.physicalExercisesLowerBody,
              ...formData.physicalExercisesUpperBody,
              ...formData.physicalExercisesBalanceAndCoordination,
            ],
            physicalActivitiesLevel: formData.physicalExercisesLevel,
          },
        },
      },
      selectedActivity: 'custom',
    }));
  },
  handleSetWithoutLimitationActivities: formData => {
    set(state => ({
      ...initialState,
      custom: {
        ...state.custom,
        isPicked: true,
        isVisible: true,
        formValues: {
          ...initialState.custom.formValues,
          withoutLimitation: {
            breathingExercises: formData.breathingExercises,
            breathingExercisesLevel: formData.breathingExercisesLevel,
            physicalActivities: formData.physicalExercises,
            physicalActivitiesLevel: formData.physicalExercisesLevel,
            walkingTime: formData.walkingExercises,
          },
        },
      },
      selectedActivity: 'custom',
    }));
  },
  resetStore: () => set({ ...initialState }),
}));
