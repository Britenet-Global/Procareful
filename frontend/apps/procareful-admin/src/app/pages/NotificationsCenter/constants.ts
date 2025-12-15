import { PathRoutes } from '@ProcarefulAdmin/constants';
import { GetMyNotificationsDtoTitle } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';

export const redirectionPaths: Record<GetMyNotificationsDtoTitle, string> = {
  [GetMyNotificationsDtoTitle.performance_decline]: PathRoutes.SeniorProfile,
  [GetMyNotificationsDtoTitle.user_inactive_for_7_plus_days]: PathRoutes.SeniorProfile,
  [GetMyNotificationsDtoTitle.monitoring_visit_request]: PathRoutes.SeniorProfile,
  [GetMyNotificationsDtoTitle.new_senior_assigned]: PathRoutes.SeniorProfile,
  [GetMyNotificationsDtoTitle.new_informal_caregiver_assigned_to_senior]: PathRoutes.SeniorProfile,
  [GetMyNotificationsDtoTitle.new_formal_caregiver_assigned_to_senior]: PathRoutes.SeniorProfile,
  [GetMyNotificationsDtoTitle.user_completed_their_daily_assignment]: PathRoutes.SeniorProfile,
  [GetMyNotificationsDtoTitle.new_note_added]: PathRoutes.SeniorProfile,
  [GetMyNotificationsDtoTitle.new_document_uploaded]: PathRoutes.SeniorProfile,
  [GetMyNotificationsDtoTitle.new_care_plan_assigned]: PathRoutes.SeniorProfile,
  [GetMyNotificationsDtoTitle.new_care_plan_changed]: PathRoutes.SeniorProfile,
  [GetMyNotificationsDtoTitle.role_updated]: PathRoutes.SeniorProfile,
};

export const EXCLAMATION_MARK = '!';

export const notificationTitle: Record<GetMyNotificationsDtoTitle, string> = {
  get [GetMyNotificationsDtoTitle.performance_decline]() {
    return i18n.t('admin_table_performance_warning');
  },
  get [GetMyNotificationsDtoTitle.user_inactive_for_7_plus_days]() {
    return i18n.t('admin_table_user_inactive_for_7_plus_days');
  },
  get [GetMyNotificationsDtoTitle.monitoring_visit_request]() {
    return i18n.t('admin_table_monitoring_visit_requested');
  },
  get [GetMyNotificationsDtoTitle.new_senior_assigned]() {
    return i18n.t('admin_table_new_senior_assigned');
  },
  get [GetMyNotificationsDtoTitle.new_informal_caregiver_assigned_to_senior]() {
    return i18n.t('admin_table_new_informal_caregiver_assigned_to_senior');
  },
  get [GetMyNotificationsDtoTitle.new_formal_caregiver_assigned_to_senior]() {
    return i18n.t('admin_table_new_formal_caregiver_assigned_to_senior');
  },
  get [GetMyNotificationsDtoTitle.user_completed_their_daily_assignment]() {
    return i18n.t('admin_table_user_completed_their_daily_assignment');
  },
  get [GetMyNotificationsDtoTitle.new_note_added]() {
    return i18n.t('admin_table_new_note_added');
  },
  get [GetMyNotificationsDtoTitle.new_document_uploaded]() {
    return i18n.t('admin_table_new_document');
  },
  get [GetMyNotificationsDtoTitle.new_care_plan_assigned]() {
    return i18n.t('admin_title_new_care_plan_assigned');
  },
  get [GetMyNotificationsDtoTitle.new_care_plan_changed]() {
    return i18n.t('admin_title_new_care_plan_changed');
  },
  get [GetMyNotificationsDtoTitle.role_updated]() {
    return i18n.t('admin_title_role_updated');
  },
};
