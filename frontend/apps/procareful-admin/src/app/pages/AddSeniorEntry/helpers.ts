import { i18n } from '@Procareful/common/i18n';

export const getContentByAssessmentStatus = (isSeniorConditionAssessment: boolean) => {
  if (isSeniorConditionAssessment) {
    return {
      title: i18n.t('admin_title_condition_assessment'),
      subtitle: i18n.t('admin_inf_senior_condition_data'),
      info: i18n.t('admin_inf_time_spend_on_form'),
    };
  }

  return {
    title: i18n.t('admin_title_register_new_senior'),
    subtitle: i18n.t('admin_inf_collect_crucial_details'),
    info: i18n.t('admin_inf_procareful_is_here_to_guide'),
  };
};
