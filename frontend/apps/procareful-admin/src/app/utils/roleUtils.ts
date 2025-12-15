import type { SelectProps } from 'antd';
import {
  AdminInstitutionControllerGetFormalCaregiversFilterCaregiverRolesRoleName,
  type AdminRolesDto,
  type AdminRolesDtoRoleName,
} from '@Procareful/common/api';

export const verifyAccessByRole = (
  roleName: AdminRolesDtoRoleName | AdminRolesDtoRoleName[],
  userRoles?: AdminRolesDto[]
) => {
  if (Array.isArray(roleName)) {
    return !!userRoles?.some(userRole => roleName.includes(userRole.role_name));
  }

  return !!userRoles?.some(userRole => userRole.role_name === roleName);
};

export const selectRoleOptions: SelectProps['options'] = [
  {
    label: 'admin_title_caregiver_role_social_worker',
    value: AdminInstitutionControllerGetFormalCaregiversFilterCaregiverRolesRoleName.social_worker,
  },
  {
    label: 'admin_title_caregiver_role_health_care_professional',
    value:
      AdminInstitutionControllerGetFormalCaregiversFilterCaregiverRolesRoleName.health_care_professional,
  },
  {
    label: 'admin_title_caregiver_role_care_worker',
    value: AdminInstitutionControllerGetFormalCaregiversFilterCaregiverRolesRoleName.care_worker,
  },
  {
    label: 'admin_title_caregiver_role_volunteer',
    value: AdminInstitutionControllerGetFormalCaregiversFilterCaregiverRolesRoleName.volunteer,
  },
  {
    label: 'admin_title_caregiver_role_psychologist',
    value: AdminInstitutionControllerGetFormalCaregiversFilterCaregiverRolesRoleName.psychologist,
  },
  {
    label: 'admin_title_caregiver_role_socialization_coordinator',
    value:
      AdminInstitutionControllerGetFormalCaregiversFilterCaregiverRolesRoleName.socialization_coordinator,
  },
  {
    label: 'admin_title_caregiver_role_informal_caregiver',
    value:
      AdminInstitutionControllerGetFormalCaregiversFilterCaregiverRolesRoleName.informal_caregiver,
  },
  {
    label: 'admin_title_caregiver_role_other',
    value: AdminInstitutionControllerGetFormalCaregiversFilterCaregiverRolesRoleName.other,
  },
];
