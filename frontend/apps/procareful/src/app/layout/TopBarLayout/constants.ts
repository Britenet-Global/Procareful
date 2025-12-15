import { i18n } from '@Procareful/common/i18n';
import { ProcarefulAppPathRoutes } from '@Procareful/common/lib';

export const topBarLayoutTitle = {
  get [ProcarefulAppPathRoutes.Games]() {
    return i18n.t('senior_title_game');
  },
  get [ProcarefulAppPathRoutes.PersonalGrowth]() {
    return i18n.t('shared_title_personal_growth');
  },
  get [ProcarefulAppPathRoutes.MyDiary]() {
    return i18n.t('senior_title_my_diary');
  },
  get [ProcarefulAppPathRoutes.MyDiaryDetails]() {
    return i18n.t('senior_title_my_diary');
  },
  get [ProcarefulAppPathRoutes.PhysicalActivitiesStartYourDay]() {
    return i18n.t('senior_title_start_your_day');
  },
  get [ProcarefulAppPathRoutes.PhysicalActivitiesStayActive]() {
    return i18n.t('senior_title_stay_active');
  },
  get [ProcarefulAppPathRoutes.PhysicalActivitiesExercises]() {
    return i18n.t('senior_title_stay_active');
  },
  get [ProcarefulAppPathRoutes.PhysicalActivitiesBreathing]() {
    return i18n.t('senior_title_breathing');
  },
  get [ProcarefulAppPathRoutes.PhysicalActivitiesDawnDeepBreaths]() {
    return i18n.t('senior_title_dawn_deep_breaths');
  },
  get [ProcarefulAppPathRoutes.PhysicalActivitiesTwilightBreaths]() {
    return i18n.t('senior_title_twilight_breaths');
  },
  get [ProcarefulAppPathRoutes.PhysicalActivitiesWalking]() {
    return i18n.t('shared_title_walking');
  },
  get [ProcarefulAppPathRoutes.Settings]() {
    return i18n.t('senior_title_settings');
  },
};
