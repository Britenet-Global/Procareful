import { DayDtoName } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';

export const weekDaysOptions = [
  {
    get label() {
      return i18n.t('admin_form_monday');
    },
    value: DayDtoName.Monday,
  },
  {
    get label() {
      return i18n.t('admin_form_tuesday');
    },
    value: DayDtoName.Tuesday,
  },
  {
    get label() {
      return i18n.t('admin_form_wednesday');
    },
    value: DayDtoName.Wednesday,
  },
  {
    get label() {
      return i18n.t('admin_form_thursday');
    },
    value: DayDtoName.Thursday,
  },
  {
    get label() {
      return i18n.t('admin_form_friday');
    },
    value: DayDtoName.Friday,
  },
  {
    get label() {
      return i18n.t('admin_form_saturday');
    },
    value: DayDtoName.Saturday,
  },
  {
    get label() {
      return i18n.t('admin_form_sunday');
    },
    value: DayDtoName.Sunday,
  },
];

export const WEEKDAYS_ORDER = [
  DayDtoName.Monday,
  DayDtoName.Tuesday,
  DayDtoName.Wednesday,
  DayDtoName.Thursday,
  DayDtoName.Friday,
  DayDtoName.Saturday,
  DayDtoName.Sunday,
];
