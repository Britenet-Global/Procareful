import { PathRoutes } from '@ProcarefulAdmin/constants';

export const getFormalCaregiverConfig = [
  {
    id: '1',
    title: 'admin_title_professional_profile',
    redirectTo: PathRoutes.ProfessionalProfile,
  },
  {
    id: '2',
    title: 'admin_title_notifications_preferences',
    redirectTo: PathRoutes.NotificationPreferences,
  },
];

export const getInformalCaregiverConfig = [
  {
    id: '1',
    title: 'admin_title_notifications_preferences',
    redirectTo: PathRoutes.NotificationPreferences,
  },
];
