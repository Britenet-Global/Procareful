import { AdminRolesDtoRoleName } from '@Procareful/common/api';

export const roles = {
  [AdminRolesDtoRoleName.adminInstitution]: 'admin_title_institution_admin',
  [AdminRolesDtoRoleName.formalCaregiver]: 'admin_title_formal_caregiver',
  [AdminRolesDtoRoleName.informalCaregiver]: 'admin_title_informal_caregiver',
  [AdminRolesDtoRoleName.headAdmin]: 'admin_title_head_admin',
  [AdminRolesDtoRoleName.superAdminInstitution]: 'admin_title_institution_super_admin',
  [AdminRolesDtoRoleName.adminML]: '',
};
