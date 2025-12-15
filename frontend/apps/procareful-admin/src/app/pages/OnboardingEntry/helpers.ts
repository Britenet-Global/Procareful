import { type AdminRolesDto, AdminRolesDtoRoleName } from '@Procareful/common/api';
import { type ConfigKey, configForIAAndFC, welcomeCardConfig } from './constants';

export const getConfigForRoles = (roles?: AdminRolesDto[]) => {
  if (!roles) {
    return [];
  }
  const roleNames = roles?.map(role => role.role_name);

  if (
    roleNames.includes(AdminRolesDtoRoleName.formalCaregiver) &&
    roleNames.includes(AdminRolesDtoRoleName.informalCaregiver)
  ) {
    return configForIAAndFC;
  }

  for (const role of roleNames) {
    if (welcomeCardConfig[role as ConfigKey]) {
      return welcomeCardConfig[role as ConfigKey];
    }
  }
};
