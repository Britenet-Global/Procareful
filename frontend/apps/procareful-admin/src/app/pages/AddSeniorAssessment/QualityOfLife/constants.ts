import {
  AddQualityOfLifeDtoAnxietyDepression,
  AddQualityOfLifeDtoMobility,
  AddQualityOfLifeDtoMotivation,
  AddQualityOfLifeDtoPainDiscomfort,
  AddQualityOfLifeDtoSelfCare,
  AddQualityOfLifeDtoUsualActivities,
} from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';

export const motivationOptions = [
  {
    get label() {
      return i18n.t('admin_form_low');
    },
    value: AddQualityOfLifeDtoMotivation.Low,
  },
  {
    get label() {
      return i18n.t('admin_form_medium');
    },
    value: AddQualityOfLifeDtoMotivation.Medium,
  },
  {
    get label() {
      return i18n.t('admin_form_high');
    },
    value: AddQualityOfLifeDtoMotivation.High,
  },
];

export const mobilityOptions = [
  {
    get label() {
      return i18n.t('admin_inf_mobility_option_none');
    },
    value: AddQualityOfLifeDtoMobility.none,
  },
  {
    get label() {
      return i18n.t('admin_inf_mobility_option_slight');
    },
    value: AddQualityOfLifeDtoMobility.slight,
  },
  {
    get label() {
      return i18n.t('admin_inf_mobility_option_moderate');
    },
    value: AddQualityOfLifeDtoMobility.moderate,
  },
  {
    get label() {
      return i18n.t('admin_inf_mobility_option_severe');
    },
    value: AddQualityOfLifeDtoMobility.severe,
  },
  {
    get label() {
      return i18n.t('admin_inf_mobility_option_extreme');
    },
    value: AddQualityOfLifeDtoMobility.extreme,
  },
];

export const selfCareOptions = [
  {
    get label() {
      return i18n.t('admin_inf_self_care_option_none');
    },
    value: AddQualityOfLifeDtoSelfCare.none,
  },
  {
    get label() {
      return i18n.t('admin_inf_self_care_option_slight');
    },
    value: AddQualityOfLifeDtoSelfCare.slight,
  },
  {
    get label() {
      return i18n.t('admin_inf_self_care_option_moderate');
    },
    value: AddQualityOfLifeDtoSelfCare.moderate,
  },
  {
    get label() {
      return i18n.t('admin_inf_self_care_option_severe');
    },
    value: AddQualityOfLifeDtoSelfCare.severe,
  },
  {
    get label() {
      return i18n.t('admin_inf_self_care_option_extreme');
    },
    value: AddQualityOfLifeDtoSelfCare.extreme,
  },
];

export const usualActivitiesOptions = [
  {
    get label() {
      return i18n.t('admin_inf_usual_activities_option_none');
    },
    value: AddQualityOfLifeDtoUsualActivities.none,
  },
  {
    get label() {
      return i18n.t('admin_inf_usual_activities_option_slight');
    },
    value: AddQualityOfLifeDtoUsualActivities.slight,
  },
  {
    get label() {
      return i18n.t('admin_inf_usual_activities_option_moderate');
    },
    value: AddQualityOfLifeDtoUsualActivities.moderate,
  },
  {
    get label() {
      return i18n.t('admin_inf_usual_activities_option_severe');
    },
    value: AddQualityOfLifeDtoUsualActivities.severe,
  },
  {
    get label() {
      return i18n.t('admin_inf_usual_activities_option_extreme');
    },
    value: AddQualityOfLifeDtoUsualActivities.extreme,
  },
];

export const painDiscomfortOptions = [
  {
    get label() {
      return i18n.t('admin_inf_pain_discomfort_option_none');
    },
    value: AddQualityOfLifeDtoPainDiscomfort.none,
  },
  {
    get label() {
      return i18n.t('admin_inf_pain_discomfort_option_slight');
    },
    value: AddQualityOfLifeDtoPainDiscomfort.slight,
  },
  {
    get label() {
      return i18n.t('admin_inf_pain_discomfort_option_moderate');
    },
    value: AddQualityOfLifeDtoPainDiscomfort.moderate,
  },
  {
    get label() {
      return i18n.t('admin_inf_pain_discomfort_option_severe');
    },
    value: AddQualityOfLifeDtoPainDiscomfort.severe,
  },
  {
    get label() {
      return i18n.t('admin_inf_pain_discomfort_option_extreme');
    },
    value: AddQualityOfLifeDtoPainDiscomfort.extreme,
  },
];

export const anxietyDepressionOptions = [
  {
    get label() {
      return i18n.t('admin_inf_anxiety_depression_option_none');
    },
    value: AddQualityOfLifeDtoAnxietyDepression.none,
  },
  {
    get label() {
      return i18n.t('admin_inf_anxiety_depression_option_slight');
    },
    value: AddQualityOfLifeDtoAnxietyDepression.slight,
  },
  {
    get label() {
      return i18n.t('admin_inf_anxiety_depression_option_moderate');
    },
    value: AddQualityOfLifeDtoAnxietyDepression.moderate,
  },
  {
    get label() {
      return i18n.t('admin_inf_anxiety_depression_option_severe');
    },
    value: AddQualityOfLifeDtoAnxietyDepression.severe,
  },
  {
    get label() {
      return i18n.t('admin_inf_anxiety_depression_option_extreme');
    },
    value: AddQualityOfLifeDtoAnxietyDepression.extreme,
  },
];
