import type { AdminRoles } from '@ProcarefulAdmin/typings';
import { RoleDtoRoleName } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';

export const getInitialModalConfigForRoles = (roles?: AdminRoles) => {
  for (const { role_name } of roles || []) {
    switch (role_name) {
      case RoleDtoRoleName.formalCaregiver:
        return {
          modalTitle: i18n.t('admin_title_delete_caregiver'),
          modalNotificationTitle: i18n.t('admin_inf_delete_formal_caregiver_notification_title'),
          modalNotificationSubtitle: i18n.t('admin_inf_delete_caregiver_notification_subtitle'),
          modalFooter: i18n.t('admin_inf_delete_formal_caregiver_confirmation'),
          modalConfirmButtonText: i18n.t('admin_btn_delete_caregiver'),
        };
      case RoleDtoRoleName.informalCaregiver:
        return {
          modalTitle: i18n.t('admin_title_delete_caregiver'),
          modalNotificationTitle: i18n.t('admin_inf_delete_informal_caregiver_notification_title'),
          modalNotificationSubtitle: i18n.t('admin_inf_delete_caregiver_notification_subtitle'),
          modalFooter: i18n.t('admin_inf_delete_informal_caregiver_confirmation'),
          modalConfirmButtonText: i18n.t('admin_btn_delete_caregiver'),
        };
      case RoleDtoRoleName.superAdminInstitution:
        return {
          modalTitle: i18n.t('admin_title_delete_institution'),
          modalNotificationTitle: i18n.t('admin_inf_delete_institution_notification_title'),
          modalNotificationSubtitle: i18n.t('admin_inf_delete_institution_notification_subtitle'),
          modalFooter: i18n.t('admin_inf_delete_institution_confirmation'),
          modalConfirmButtonText: i18n.t('admin_btn_delete_institution'),
        };
      case RoleDtoRoleName.adminInstitution:
        return {
          modalTitle: i18n.t('admin_title_delete_institution_admin'),
          modalNotificationTitle: i18n.t('admin_inf_delete_institution_admin_notification_title'),
          modalNotificationSubtitle: i18n.t(
            'admin_inf_delete_institution_admin_notification_subtitle'
          ),
          modalFooter: i18n.t('admin_inf_delete_institution_confirmation_admin'),
          modalConfirmButtonText: i18n.t('admin_btn_delete_institution_admin'),
        };
    }
  }

  // Apply default configuration for unspecified roles (e.g., Senior)
  return {
    modalTitle: i18n.t('admin_title_delete_senior'),
    modalNotificationTitle: i18n.t('admin_inf_delete_senior_notification_title'),
    modalNotificationSubtitle: i18n.t('admin_inf_delete_senior_notification_subtitle'),
    modalFooter: i18n.t('admin_inf_delete_senior_confirmation'),
    modalConfirmButtonText: i18n.t('admin_btn_delete_senior'),
  };
};

export const getFinalModalConfigForRoles = (roles?: AdminRoles) => {
  for (const { role_name } of roles || []) {
    switch (role_name) {
      case RoleDtoRoleName.formalCaregiver:
        return {
          modalTitle: i18n.t('admin_title_delete_caregiver_confirmation'),
          modalNotificationTitle: i18n.t('admin_inf_delete_user_notification_title_confirmation'),
          modalNotificationSubtitle: i18n.t(
            'admin_inf_delete_user_notification_subtitle_confirmation'
          ),
          modalFooter: i18n.t('admin_inf_delete_formal_caregiver_footer'),
          modalConfirmButtonText: i18n.t('admin_btn_delete_caregiver_confirmation'),
        };
      case RoleDtoRoleName.informalCaregiver:
        return {
          modalTitle: i18n.t('admin_title_delete_caregiver_confirmation'),
          modalNotificationTitle: i18n.t('admin_inf_delete_user_notification_title_confirmation'),
          modalNotificationSubtitle: i18n.t(
            'admin_inf_delete_user_notification_subtitle_confirmation'
          ),
          modalFooter: i18n.t('admin_inf_delete_informal_caregiver_footer'),
          modalConfirmButtonText: i18n.t('admin_btn_delete_caregiver_confirmation'),
        };
      case RoleDtoRoleName.superAdminInstitution:
        return {
          modalTitle: i18n.t('admin_title_delete_institution_confirmation'),
          modalNotificationTitle: i18n.t('admin_inf_delete_user_notification_title_confirmation'),
          modalNotificationSubtitle: i18n.t(
            'admin_inf_delete_user_notification_subtitle_confirmation'
          ),
          modalFooter: i18n.t('admin_inf_delete_institution_footer'),
          modalConfirmButtonText: i18n.t('admin_btn_delete_institution_confirmation'),
        };
      case RoleDtoRoleName.adminInstitution:
        return {
          modalTitle: i18n.t('admin_title_delete_institution_admin_confirmation'),
          modalNotificationTitle: i18n.t('admin_inf_delete_user_notification_title_confirmation'),
          modalNotificationSubtitle: i18n.t(
            'admin_inf_delete_user_notification_subtitle_confirmation'
          ),
          modalFooter: i18n.t('admin_inf_delete_institution_admin_footer'),
          modalConfirmButtonText: i18n.t('admin_btn_delete_institution_admin_confirmation'),
        };
    }
  }

  // Apply default configuration for unspecified roles (e.g., Senior)
  return {
    modalTitle: i18n.t('admin_title_delete_senior_confirmation'),
    modalNotificationTitle: i18n.t('admin_inf_delete_user_notification_title_confirmation'),
    modalNotificationSubtitle: i18n.t('admin_inf_delete_user_notification_subtitle_confirmation'),
    modalFooter: i18n.t('admin_inf_delete_senior_confirmation'),
    modalConfirmButtonText: i18n.t('admin_btn_delete_senior_confirmation'),
  };
};

// Normalizes quotation marks in strings and compares them for equality, ignoring quotation mark styles.
export const normalizeQuotes = (str: string): string =>
  str.replace(/[\u2018\u2019\u201C\u201D"']/g, match => {
    switch (match) {
      case '\u2018':
      case '\u2019':
      case "'":
        return "'";
      default:
        return '"';
    }
  });

export const getProperPlaceholder = (roles?: AdminRoles) => {
  for (const { role_name } of roles || []) {
    switch (role_name) {
      case RoleDtoRoleName.formalCaregiver:
        return i18n.t('admin_inf_delete_user_modal_placeholder_caregiver');
      case RoleDtoRoleName.informalCaregiver:
        return i18n.t('admin_inf_delete_user_modal_placeholder_caregiver');
      case RoleDtoRoleName.superAdminInstitution:
        return i18n.t('admin_inf_delete_user_modal_placeholder_institution');
      case RoleDtoRoleName.adminInstitution:
        return i18n.t('admin_inf_delete_user_modal_placeholder_admin');
    }
  }

  return i18n.t('admin_inf_delete_user_modal_placeholder_senior');
};
