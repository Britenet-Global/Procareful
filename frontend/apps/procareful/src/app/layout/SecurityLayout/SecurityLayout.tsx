import { ProcarefulAppPathRoutes } from '@Procareful/common/lib/constants';
import { Navigate, Outlet } from 'react-router-dom';

type SecurityLayoutProps = {
  isUserBlocked: boolean;
};

const SecurityLayout = ({ isUserBlocked }: SecurityLayoutProps) =>
  isUserBlocked ? <Navigate to={ProcarefulAppPathRoutes.LoginSecurityAlert} /> : <Outlet />;

export default SecurityLayout;
