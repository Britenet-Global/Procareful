import { Navigate, Outlet } from 'react-router-dom';
import { type PathRoutes } from '@ProcarefulAdmin/constants';

type PublicRouteProps = {
  isAuthenticated: boolean;
  redirectPath: PathRoutes;
};

const PublicRoute = ({ isAuthenticated, redirectPath }: PublicRouteProps) => {
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
