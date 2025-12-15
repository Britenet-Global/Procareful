import { Navigate } from 'react-router-dom';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import AdminDashboard from './AdminDashboard';
import FormalCaregiverDashboard from './FormalCaregiverDashboard';
import InformalCaregiverDashboard from './InformalCaregiverDashboard';

export const dashboardBasedOnRole = {
  formalCaregiver: <FormalCaregiverDashboard />,
  adminInstitution: <AdminDashboard />,
  superAdminInstitution: <AdminDashboard />,
  informalCaregiver: <InformalCaregiverDashboard />,
  headAdmin: <Navigate to={PathRoutes.Institutions} replace />,
  adminML: <Navigate to={PathRoutes.NotFound} replace />,
};
