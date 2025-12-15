import { type ButtonType } from 'antd/es/button';
import type { AdminRoles, UserStatus } from '@ProcarefulAdmin/typings';
import { verifyAccessByRole } from '@ProcarefulAdmin/utils';
import {
  AdminRolesDtoRoleName,
  StatusStatusName,
  type AdminRolesDto,
} from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';

type StatusConfig = {
  title: string;
  subtitle: string;
  buttonText: string;
  danger: boolean;
  textContent?: string;
  deleteButtonText: string;
  deleteButtonType?: ButtonType;
};

const baseConfigs: Record<StatusStatusName, StatusConfig> = {
  [StatusStatusName.active]: {
    get title() {
      return i18n.t('admin_inf_deactivate_user');
    },
    get subtitle() {
      return i18n.t('admin_inf_deactivate_user_data_retained_for_30_days');
    },
    get buttonText() {
      return i18n.t('admin_btn_deactivate');
    },
    danger: true,
    get deleteButtonText() {
      return i18n.t('admin_btn_delete_user');
    },
  },
  [StatusStatusName.created]: {
    get title() {
      return i18n.t('admin_inf_remove_user');
    },
    get subtitle() {
      return i18n.t('admin_inf_remove_user_subtitle_active');
    },
    get buttonText() {
      return i18n.t('admin_btn_deactivate');
    },
    danger: true,
    get deleteButtonText() {
      return i18n.t('admin_btn_delete_user');
    },
    deleteButtonType: 'default',
  },
  [StatusStatusName.inactive]: {
    get title() {
      return i18n.t('admin_inf_deactivate_user');
    },
    get subtitle() {
      return i18n.t('admin_inf_deactivate_user_subtitle_inactive');
    },
    get buttonText() {
      return i18n.t('admin_btn_activate');
    },
    danger: false,
    get deleteButtonText() {
      return i18n.t('admin_btn_delete_user');
    },
    get textContent() {
      return i18n.t('admin_inf_deactivate_user_subtitle_inactive');
    },
    deleteButtonType: 'text',
  },
};

const superAdminCustomizations = {
  [StatusStatusName.active]: {
    get title() {
      return i18n.t('admin_inf_deactivate_institution');
    },
    get subtitle() {
      return i18n.t('admin_inf_deactivate_institution_subtitle_active');
    },
    get deleteButtonText() {
      return i18n.t('admin_btn_delete_institution');
    },
  },
  [StatusStatusName.created]: {
    get title() {
      return i18n.t('admin_inf_remove_institution');
    },
    get subtitle() {
      return i18n.t('admin_inf_remove_institution_subtitle_active');
    },
    get deleteButtonText() {
      return i18n.t('admin_btn_delete_institution');
    },
  },
  [StatusStatusName.inactive]: {
    get title() {
      return i18n.t('admin_inf_deactivate_institution');
    },
    get subtitle() {
      return i18n.t('admin_inf_activate_or_remove_institution_subtitle_inactive');
    },
    get deleteButtonText() {
      return i18n.t('admin_btn_delete_institution');
    },
  },
};

export const getStatusConfig = (status: UserStatus, roles?: AdminRoles) => {
  const baseConfig = baseConfigs[status];
  const isSuperAdmin = verifyAccessByRole(
    AdminRolesDtoRoleName.superAdminInstitution,
    roles as AdminRolesDto[]
  );

  if (isSuperAdmin) {
    return {
      ...baseConfig,
      ...superAdminCustomizations[status],
    };
  }

  return baseConfig;
};

export const getModalConfigForRoles = (roles?: AdminRoles) => {
  for (const { role_name } of roles || []) {
    switch (role_name) {
      case AdminRolesDtoRoleName.formalCaregiver:
        return {
          deactivateModalTitle: i18n.t('admin_title_deactivate_caregiver'),
          deactivateModalNotificationTitle: i18n.t('admin_inf_deactivate_user_notification_title'),
          deactivateModalNotificationSubtitle: i18n.t(
            'admin_inf_deactivate_user_notification_subtitle'
          ),
          deactivateModalFooter: i18n.t('admin_inf_deactivate_formal_caregiver_confirmation'),
        };
      case AdminRolesDtoRoleName.informalCaregiver:
        return {
          deactivateModalTitle: i18n.t('admin_title_deactivate_caregiver'),
          deactivateModalNotificationTitle: i18n.t('admin_inf_deactivate_user_notification_title'),
          deactivateModalNotificationSubtitle: i18n.t(
            'admin_inf_deactivate_user_notification_subtitle'
          ),
          deactivateModalFooter: i18n.t('admin_inf_deactivate_informal_caregiver_confirmation'),
        };
      case AdminRolesDtoRoleName.superAdminInstitution:
        return {
          deactivateModalTitle: i18n.t('admin_title_deactivate_institution'),
          deactivateModalNotificationTitle: i18n.t('admin_inf_deactivate_user_notification_title'),
          deactivateModalNotificationSubtitle: i18n.t(
            'admin_inf_deactivate_user_notification_subtitle'
          ),
          deactivateModalFooter: i18n.t('admin_inf_deactivate_institution_confirmation'),
        };
      case AdminRolesDtoRoleName.adminInstitution:
        return {
          deactivateModalTitle: i18n.t('admin_title_deactivate_institution_admin'),
          deactivateModalNotificationTitle: i18n.t('admin_inf_deactivate_user_notification_title'),
          deactivateModalNotificationSubtitle: i18n.t(
            'admin_inf_deactivate_user_notification_subtitle'
          ),
          deactivateModalFooter: i18n.t('admin_inf_deactivate_institution_admin_confirmation'),
        };
    }
  }

  // Apply default configuration for unspecified roles (e.g., Senior)
  return {
    deactivateModalTitle: i18n.t('admin_title_deactivate_senior'),
    deactivateModalNotificationTitle: i18n.t('admin_inf_deactivate_user_notification_title'),
    deactivateModalNotificationSubtitle: i18n.t('admin_inf_deactivate_user_notification_subtitle'),
    deactivateModalFooter: i18n.t('admin_inf_deactivate_senior_confirmation'),
  };
};
