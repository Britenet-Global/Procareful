import { i18n } from '@Procareful/common/i18n';

const MINUTES_IN_AN_HOUR = 60;

export const formatMinutes = (minutes?: number) => {
  if (!minutes) {
    return;
  }

  if (minutes < MINUTES_IN_AN_HOUR) {
    return `${minutes}${i18n.t('admin_inf_minute')}`;
  }

  const hours = Math.floor(minutes / MINUTES_IN_AN_HOUR);
  const remainingMinutes = minutes % MINUTES_IN_AN_HOUR;

  if (remainingMinutes === 0) {
    return `${hours}${i18n.t('admin_inf_hour')}`;
  }

  return `${hours}${i18n.t('admin_inf_hour')} ${remainingMinutes}${i18n.t('admin_inf_minute')}`;
};
