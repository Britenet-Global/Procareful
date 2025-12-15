import { i18n } from '@Procareful/common/i18n';
import { type TagColor } from '@Procareful/ui';

export const tagStatus = {
  get active() {
    return i18n.t('admin_form_status_active');
  },
  get created() {
    return i18n.t('admin_form_status_created');
  },
  get inactive() {
    return i18n.t('admin_form_status_inactive');
  },
};

export const tagColor: Record<string, TagColor> = {
  active: 'teal',
  created: 'default',
  inactive: 'red',
};
