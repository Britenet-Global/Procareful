import { PathRoutes } from '@ProcarefulAdmin/constants';

export const getInstitutionConfig = [
  {
    id: '0',
    title: 'admin_title_institution_details',
    redirectTo: PathRoutes.InstitutionDetails,
  },
  {
    id: '1',
    title: 'admin_title_support_management',
    redirectTo: PathRoutes.SupportManagement,
  },
  {
    id: '2',
    title: 'admin_title_users',
    redirectTo: PathRoutes.InstitutionUsers,
  },
  {
    id: '3',
    title: 'admin_title_institution_admins',
    redirectTo: PathRoutes.InstitutionAdmins,
  },
];
