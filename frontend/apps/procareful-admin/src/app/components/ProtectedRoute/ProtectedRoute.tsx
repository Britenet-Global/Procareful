import { type PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { PathRoutes } from '@ProcarefulAdmin/constants';

type ProtectedRouteProps = PropsWithChildren<{
  isAuthenticated: boolean;
  isAuthorized: boolean;
  redirectPath: PathRoutes;
}>;

const ProtectedRoute = ({
  isAuthenticated,
  isAuthorized,
  redirectPath,
  children,
}: ProtectedRouteProps) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  if (!isAuthorized) {
    return <Navigate to={PathRoutes.NotFound} replace />;
  }

  return children;
};

export default ProtectedRoute;
