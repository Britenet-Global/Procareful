import { PathRoutes } from '@ProcarefulAdmin/constants';
import { AdminRolesDtoRoleName } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';

const formalCaregiverConfig = [
  {
    id: '0',
    get title() {
      return i18n.t('admin_title_onboarding_step_complete_personal_profile');
    },
    get subtitle() {
      return i18n.t('admin_inf_onboarding_step_complete_personal_profile_subtitle');
    },
    redirectTo: PathRoutes.ManageYourProfile,
    stepOrder: '1',
  },

  {
    id: '1',
    get title() {
      return i18n.t('admin_title_onboarding_step_enhance_professional_profile');
    },
    get subtitle() {
      return i18n.t('admin_inf_onboarding_step_enhance_professional_profile_subtitle');
    },
    redirectTo: PathRoutes.ProfessionalProfile,
    stepOrder: '2',
  },
  {
    id: '2',
    get title() {
      return i18n.t('admin_title_onboarding_step_set_notification_preferences');
    },
    get subtitle() {
      return i18n.t('admin_inf_onboarding_step_set_notification_preferences_subtitle');
    },
    redirectTo: PathRoutes.NotificationPreferences,
    stepOrder: '3',
  },
  {
    id: '3',
    get title() {
      return i18n.t('admin_title_onboarding_step_prepare_assessment_senior_documentation');
    },
    get subtitle() {
      return i18n.t('admin_inf_onboarding_step_prepare_assessment_senior_documentation_subtitle');
    },
    redirectTo: PathRoutes.Support,
    stepOrder: '4',
  },
  {
    id: '4',
    get title() {
      return i18n.t('admin_title_onboarding_step_add_first_senior');
    },
    get subtitle() {
      return i18n.t('admin_inf_onboarding_step_prepare_add_first_senior_subtitle');
    },
    redirectTo: PathRoutes.SeniorAddEntry,
    stepOrder: '5',
  },
];

const informalCaregiverConfig = [
  {
    id: '0',
    get title() {
      return i18n.t('admin_title_onboarding_step_complete_personal_profile');
    },
    get subtitle() {
      return i18n.t('admin_inf_onboarding_step_complete_personal_profile_subtitle');
    },
    redirectTo: PathRoutes.ManageYourProfile,
    stepOrder: '1',
  },

  {
    id: '1',
    get title() {
      return i18n.t('admin_title_onboarding_step_set_notification_preferences');
    },
    get subtitle() {
      return i18n.t('admin_inf_onboarding_step_set_notification_preferences_subtitle');
    },
    redirectTo: PathRoutes.NotificationPreferences,
    stepOrder: '2',
  },
  {
    id: '2',
    get title() {
      return i18n.t('admin_title_onboarding_step_activate_seniors_app');
    },
    get subtitle() {
      return i18n.t('admin_inf_onboarding_step_prepare_activate_seniors_app_subtitle');
    },
    redirectTo: PathRoutes.Seniors,
    stepOrder: '3',
  },
];

const institutionAdminConfig = [
  {
    id: '0',
    get title() {
      return i18n.t('admin_title_check_institution_details');
    },
    get subtitle() {
      return i18n.t('admin_inf_check_institution_details_subtitle');
    },
    completed: true,
    redirectTo: PathRoutes.InstitutionDetails,
    stepOrder: '1',
  },
  {
    id: '1',
    get title() {
      return i18n.t('admin_title_review_support_and_contacts');
    },
    get subtitle() {
      return i18n.t('admin_inf_review_support_and_contacts_subtitle');
    },
    redirectTo: PathRoutes.SupportManagement,
    stepOrder: '2',
  },
  {
    id: '2',
    get title() {
      return i18n.t('admin_title_onboarding_step_manage_users');
    },
    get subtitle() {
      return i18n.t('admin_inf_onboarding_step_manage_users_subtitle');
    },
    redirectTo: PathRoutes.InstitutionUsers,
    stepOrder: '3',
  },
];

const combinedFormalCaregiverAndAdminConfig = [
  ...formalCaregiverConfig,
  {
    id: '3',
    get title() {
      return i18n.t('admin_title_onboarding_step_manage_institution');
    },
    get subtitle() {
      return i18n.t('admin_inf_onboarding_step_manage_institution_subtitle');
    },
    redirectTo: PathRoutes.Institution,
    stepOrder: '6',
  },
];

const superInstitutionAdminConfig = [
  {
    id: '0',
    get title() {
      return i18n.t('admin_title_onboarding_step_complete_institution_profile');
    },
    get subtitle() {
      return i18n.t('admin_inf_onboarding_step_complete_institution_profile_subtitle');
    },
    completed: true,
    redirectTo: PathRoutes.InstitutionDetails,
    stepOrder: '1',
  },
  {
    id: '1',
    get title() {
      return i18n.t('admin_title_onboarding_step_set_support_hours');
    },
    get subtitle() {
      return i18n.t('admin_inf_onboarding_step_enhance_professional_profile_subtitle');
    },
    redirectTo: PathRoutes.SupportManagement,
    stepOrder: '2',
  },
  {
    id: '2',
    get title() {
      return i18n.t('admin_title_onboarding_step_manage_users');
    },
    get subtitle() {
      return i18n.t('admin_inf_onboarding_step_manage_users_subtitle');
    },
    redirectTo: PathRoutes.InstitutionUsers,
    stepOrder: '3',
  },
  {
    id: '3',
    get title() {
      return i18n.t('admin_title_onboarding_step_add_admins');
    },
    get subtitle() {
      return i18n.t('admin_title_onboarding_step_add_admins_subtitle');
    },
    redirectTo: PathRoutes.InstitutionAdmins,
    stepOrder: '4',
  },
];

export const roleConfig = [
  {
    requiredRoles: [AdminRolesDtoRoleName.formalCaregiver, AdminRolesDtoRoleName.adminInstitution],
    config: combinedFormalCaregiverAndAdminConfig,
  },
  {
    requiredRoles: [AdminRolesDtoRoleName.formalCaregiver],
    config: formalCaregiverConfig,
  },
  {
    requiredRoles: [AdminRolesDtoRoleName.informalCaregiver],
    config: informalCaregiverConfig,
  },
  {
    requiredRoles: [AdminRolesDtoRoleName.superAdminInstitution],
    config: superInstitutionAdminConfig,
  },
  {
    requiredRoles: [AdminRolesDtoRoleName.adminInstitution],
    config: institutionAdminConfig,
  },
];
