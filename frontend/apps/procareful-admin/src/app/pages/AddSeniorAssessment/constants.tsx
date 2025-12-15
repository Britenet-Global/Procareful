import { i18n } from '@Procareful/common/i18n';
import AdditionalInfo from './AdditionalInfo';
import CognitiveAbilities from './CognitiveAbilities';
import PhysicalActivityLevel from './PhysicalActivityLevel';
import QualityOfLife from './QualityOfLife';
import Sleep from './Sleep';
import SocialAbilities from './SocialAbilities';

export const seniorConditionSteps = [
  {
    get title() {
      return i18n.t('admin_title_stepper_cognitive_abilities');
    },
    content: <CognitiveAbilities />,
  },
  {
    get title() {
      return i18n.t('admin_title_stepper_physical_activity_level');
    },
    content: <PhysicalActivityLevel />,
  },
  {
    get title() {
      return i18n.t('admin_title_stepper_social_abilities');
    },
    content: <SocialAbilities />,
  },
  {
    get title() {
      return i18n.t('admin_title_stepper_quality_of_life');
    },
    content: <QualityOfLife />,
  },
  {
    get title() {
      return i18n.t('admin_title_stepper_sleep');
    },
    content: <Sleep />,
  },
  {
    get title() {
      return i18n.t('admin_title_stepper_additional_info');
    },
    content: <AdditionalInfo />,
  },
];
