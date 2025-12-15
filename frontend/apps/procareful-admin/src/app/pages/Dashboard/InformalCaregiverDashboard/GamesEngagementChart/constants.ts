import { i18n } from '@Procareful/common/i18n';

export const placeholderConfig = {
  get title() {
    return i18n.t('admin_inf_no_info_yet');
  },
  get description() {
    return i18n.t('admin_inf_no_seniors_engagement');
  },
};
