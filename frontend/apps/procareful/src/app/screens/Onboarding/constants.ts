import { i18n } from '@Procareful/common/i18n';
import TrophyGif from '@ProcarefulAppAssets/success.gif';

type OnboardingStep = {
  title: string;
  description: string;
  imagePath: string;
};

export const pagesWithButtonArray = [2, 3, 4, 5];

export const onboardingConfig = (lang: string): OnboardingStep[] => [
  {
    get title() {
      return i18n.t('admin_title_onboarding');
    },
    get description() {
      return i18n.t('senior_inf_onboarding_welcome_page');
    },
    imagePath: '/images/onboarding/onboarding_welcome.svg',
  },
  {
    get title() {
      return i18n.t('senior_title_onboarding_carousel_games_page');
    },
    get description() {
      return i18n.t('senior_inf_onboarding_carousel_games_page');
    },
    imagePath: '/images/onboarding/onboarding_games.svg',
  },
  {
    get title() {
      return i18n.t('senior_title_onboarding_carousel_activities_page');
    },
    get description() {
      return i18n.t('senior_inf_onboarding_carousel_activities_page');
    },
    imagePath: `/images/onboarding/onboarding_events_${lang}.svg`,
  },
  {
    get title() {
      return i18n.t('senior_title_onboarding_carousel_exercises_page');
    },
    get description() {
      return i18n.t('senior_inf_onboarding_carousel_exercises_page');
    },
    imagePath: `/images/onboarding/onboarding_exercises_${lang}.svg`,
  },
  {
    get title() {
      return i18n.t('senior_title_onboarding_carousel_progress_page');
    },
    get description() {
      return i18n.t('senior_inf_onboarding_carousel_progress_page');
    },
    imagePath: `/images/onboarding/onboarding_progress_${lang}.svg`,
  },
  {
    get title() {
      return i18n.t('senior_title_onboarding_end_page');
    },
    get description() {
      return i18n.t('senior_inf_onboarding_end_page');
    },
    imagePath: TrophyGif,
  },
];
