import type { AdminRolesDtoRoleName, AdminRolesDto } from '@Procareful/common/api';
import { roleConfig } from './constants';

type RoleMap = Partial<Record<AdminRolesDtoRoleName, boolean>>;

export const getOnboardingItemsBasedOnRole = (roles?: AdminRolesDto[]) => {
  const roleMap = roles?.reduce<RoleMap>((acc, { role_name }) => {
    acc[role_name] = true;

    return acc;
  }, {});

  const matchingConfig = roleConfig.find(({ requiredRoles }) =>
    requiredRoles.every(role => roleMap?.[role])
  );

  return matchingConfig?.config;
};

export const checkOnboardingStatus = (steps: boolean[]) =>
  steps.reduce(
    (acc, value) => {
      if (value) {
        acc.completedSteps += 1;
      }

      if (!value) {
        acc.remainingSteps += 1;
      }

      return acc;
    },
    { completedSteps: 0, remainingSteps: 0 }
  );
