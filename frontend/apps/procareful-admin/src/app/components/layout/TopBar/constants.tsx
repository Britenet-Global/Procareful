import { PathRoutes } from '@ProcarefulAdmin/constants/enums';

export const pathNames: Record<string, { title: string; showArrow: boolean }> = {
  [PathRoutes.Seniors]: {
    title: 'admin_title_seniors',
    showArrow: false,
  },
  [PathRoutes.Trainings]: {
    title: 'admin_title_trainings',
    showArrow: false,
  },
  [PathRoutes.InformalCaregivers]: {
    title: 'admin_title_informal_caregivers',
    showArrow: false,
  },
  [PathRoutes.FormalCaregivers]: {
    title: 'admin_title_formal_caregivers',
    showArrow: false,
  },
  [PathRoutes.Support]: {
    title: 'admin_title_support',
    showArrow: false,
  },
  [PathRoutes.SeniorProfile]: {
    title: 'admin_title_senior_profile',
    showArrow: true,
  },
  [PathRoutes.Institution]: {
    title: 'admin_title_institution',
    showArrow: false,
  },
  [PathRoutes.InstitutionDetails]: {
    title: 'admin_title_institution_institution_details',
    showArrow: true,
  },
  [PathRoutes.SupportManagement]: {
    title: 'admin_title_institution_support_management',
    showArrow: true,
  },
  [PathRoutes.InstitutionAdmins]: {
    title: 'admin_title_institution_institution_admins',
    showArrow: true,
  },
  [PathRoutes.NotificationPreferences]: {
    title: 'admin_title_settings_notification_preferences',
    showArrow: true,
  },
  [PathRoutes.InstitutionUsers]: {
    title: 'admin_title_institution_users',
    showArrow: true,
  },
  [PathRoutes.SeniorEditInstitution]: {
    title: 'admin_title_institution_senior_details',
    showArrow: true,
  },
  [PathRoutes.SeniorEdit]: {
    title: 'admin_title_institution_senior_details',
    showArrow: true,
  },
  [PathRoutes.FormalCaregiverAdd]: {
    title: 'admin_title_institution_formal_caregiver_add',
    showArrow: false,
  },
  [PathRoutes.FormalCaregiverEdit]: {
    title: 'admin_title_institution_formal_caregiver_edit',
    showArrow: true,
  },
  [PathRoutes.AddInstitutionAdmin]: {
    title: 'admin_title_institution_add_admin',
    showArrow: false,
  },
  [PathRoutes.EditInstitutionAdmin]: {
    title: 'admin_title_institution_edit_admin',
    showArrow: true,
  },
  [PathRoutes.InformalCaregiverAdd]: {
    title: 'admin_title_institution_informal_caregiver_add',
    showArrow: false,
  },
  [PathRoutes.InformalCaregiverEdit]: {
    title: 'admin_title_institution_informal_caregiver_edit',
    showArrow: true,
  },
  [PathRoutes.Settings]: {
    title: 'admin_title_settings',
    showArrow: false,
  },
  [PathRoutes.ProfessionalProfile]: {
    title: 'admin_title_professional_profile_settings',
    showArrow: true,
  },
  [PathRoutes.ActivateSeniorApp]: {
    title: 'admin_title_senior_profile',
    showArrow: true,
  },
  [PathRoutes.ManageYourProfile]: {
    title: 'admin_title_manage_your_account',
    showArrow: true,
  },
  [PathRoutes.SeniorAddPersonalInfo]: {
    title: 'admin_title_add_senior',
    showArrow: false,
  },
  [PathRoutes.SeniorAddConditionAssessment]: {
    title: 'admin_title_add_senior_condition_assessment',
    showArrow: false,
  },
  [PathRoutes.SeniorDownloadAssessmentReport]: {
    title: 'admin_title_add_senior_condition_assessment',
    showArrow: false,
  },
  [PathRoutes.SeniorAddEntry]: {
    title: 'admin_title_add_senior',
    showArrow: false,
  },
  [PathRoutes.NotificationsCenter]: {
    title: 'admin_title_notifications_center',
    showArrow: true,
  },
  [PathRoutes.SeniorAddSupportingContacts]: {
    title: 'admin_title_supporting_contacts',
    showArrow: false,
  },
  [PathRoutes.SeniorAddAssignActivities]: {
    title: 'admin_title_add_senior_assign_activities',
    showArrow: false,
  },
  [PathRoutes.SeniorBuildCustomSchedule]: {
    title: 'admin_title_add_senior_assign_activities',
    showArrow: false,
  },
  [PathRoutes.SeniorEditProfileEditSchedule]: {
    title: 'admin_title_senior_profile',
    showArrow: false,
  },
  [PathRoutes.SeniorFormalCaregiverProfile]: {
    title: 'admin_title_formal_caregiver_profile',
    showArrow: true,
  },
  [PathRoutes.ChangeInstitutionOwner]: {
    title: 'admin_title_change_institution_owner',
    showArrow: false,
  },
  [PathRoutes.InstitutionsAdd]: {
    title: 'admin_title_institution_add',
    showArrow: true,
  },
};
