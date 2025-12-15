import { roles } from '@ProcarefulAdmin/constants/roles';
import { UpdateInstitutionAdminRoleDtoRoleToAssign } from '@Procareful/common/api';

export const permissionsItems = [
  {
    label: roles[UpdateInstitutionAdminRoleDtoRoleToAssign.adminInstitution],
    value: UpdateInstitutionAdminRoleDtoRoleToAssign.adminInstitution,
  },
  {
    label: roles[UpdateInstitutionAdminRoleDtoRoleToAssign.formalCaregiver],
    value: UpdateInstitutionAdminRoleDtoRoleToAssign.formalCaregiver,
  },
];
