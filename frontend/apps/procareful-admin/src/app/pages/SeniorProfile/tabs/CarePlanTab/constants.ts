import { PathRoutes } from '@ProcarefulAdmin/constants';
import { i18n } from '@Procareful/common/i18n';

export const noDataConfig = {
  carePlan: {
    get title() {
      return i18n.t('admin_title_no_care_plan_available');
    },
    get subtitle() {
      return i18n.t('admin_inf_no_care_plan_available_subtitle');
    },
    get buttonText() {
      return i18n.t('admin_btn_assign_activities');
    },
    redirectTo: PathRoutes.SeniorEditProfileAssignActivities,
  },
  assessment: {
    get title() {
      return i18n.t('admin_title_nothing_here');
    },
    get subtitle() {
      return i18n.t('admin_inf_nothing_here_subtitle');
    },
    get buttonText() {
      return i18n.t('admin_btn_start_assessment');
    },
    redirectTo: PathRoutes.SeniorAddEntry,
  },
};
