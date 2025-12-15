import { i18n } from '@Procareful/common/i18n';

export const rolesDistributionBarChartInfo = {
  get chartDescription() {
    return i18n.t('admin_title_dashboard_chart_description_roles_distribution');
  },
  get chartTitle() {
    return i18n.t('admin_title_dashboard_chart_title_roles_distribution');
  },
  get chartSubtitle() {
    return i18n.t('admin_title_formal_caregivers');
  },
};

export const caregiversWorkloadListInfo = {
  get chartTitle() {
    return i18n.t('admin_title_dashboard_chart_title_caregivers_workload');
  },
  get chartSubtitle() {
    return i18n.t('admin_title_formal_caregivers');
  },
};
