import { AdminRolesDtoRoleName } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import CorporateFareOutlinedIcon from '@mui/icons-material/CorporateFareOutlined';
import MarkChatUnreadOutlinedIcon from '@mui/icons-material/MarkChatUnreadOutlined';
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined';
import PieChartOutlineOutlinedIcon from '@mui/icons-material/PieChartOutlineOutlined';

export type ConfigKey =
  | AdminRolesDtoRoleName.adminInstitution
  | AdminRolesDtoRoleName.formalCaregiver
  | AdminRolesDtoRoleName.informalCaregiver
  | AdminRolesDtoRoleName.superAdminInstitution;

const institutionConfig = [
  {
    icon: PieChartOutlineOutlinedIcon,
    get text() {
      return i18n.t('admin_inf_access_all_institution_data');
    },
  },
  {
    icon: PermContactCalendarOutlinedIcon,
    get text() {
      return i18n.t('admin_inf_manage_users_with_ease');
    },
  },
  {
    icon: CorporateFareOutlinedIcon,
    get text() {
      return i18n.t('admin_inf_efficiently_manage_institution_users');
    },
  },
];

const formalCaregiverConfig = [
  {
    icon: PieChartOutlineOutlinedIcon,
    get text() {
      return i18n.t('admin_inf_onboarding_monitor_progress');
    },
  },
  {
    icon: PermContactCalendarOutlinedIcon,
    get text() {
      return i18n.t('admin_inf_onboarding_optimize_scheduling');
    },
  },
  {
    icon: MarkChatUnreadOutlinedIcon,
    get text() {
      return i18n.t('admin_inf_onboarding_access_contacts');
    },
  },
];

const informalCaregiverConfig = [
  {
    icon: PieChartOutlineOutlinedIcon,
    get text() {
      return i18n.t('admin_inf_onboarding_monitor_progress');
    },
  },
  {
    icon: PermContactCalendarOutlinedIcon,
    get text() {
      return i18n.t('admin_inf_onboarding_track_ward_schedule');
    },
  },
  {
    icon: MarkChatUnreadOutlinedIcon,
    get text() {
      return i18n.t('admin_inf_onboarding_access_contacts');
    },
  },
];

export const configForIAAndFC = [
  ...formalCaregiverConfig,
  {
    icon: CorporateFareOutlinedIcon,
    get text() {
      return i18n.t('admin_inf_efficiently_manage_institution_users');
    },
  },
];

export const welcomeCardConfig: Record<ConfigKey, typeof informalCaregiverConfig> = {
  [AdminRolesDtoRoleName.superAdminInstitution]: institutionConfig,
  [AdminRolesDtoRoleName.adminInstitution]: institutionConfig,
  [AdminRolesDtoRoleName.formalCaregiver]: formalCaregiverConfig,
  [AdminRolesDtoRoleName.informalCaregiver]: informalCaregiverConfig,
};
