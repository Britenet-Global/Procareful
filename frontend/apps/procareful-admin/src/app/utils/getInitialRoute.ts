import { PathRoutes } from '@ProcarefulAdmin/constants';
import { type AdminRolesDto, AdminRolesDtoRoleName } from '@Procareful/common/api';
import { verifyAccessByRole } from './roleUtils';

export const getInitialRoute = (
  isAuthenticated: boolean,
  hasLoggedInBefore?: boolean,
  userRoles?: AdminRolesDto[]
) => {
  if (!isAuthenticated) {
    return PathRoutes.Login;
  }

  const isHeadAdmin = verifyAccessByRole(AdminRolesDtoRoleName.headAdmin, userRoles);

  if (isAuthenticated && !hasLoggedInBefore && !isHeadAdmin) {
    return PathRoutes.OnboardingEntry;
  }

  if (isHeadAdmin) {
    return PathRoutes.Institutions;
  }

  return PathRoutes.Dashboard;
};
