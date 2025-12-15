import { PathRoutes } from '@ProcarefulAdmin/constants/enums';
import { type NavigationRoute } from '@ProcarefulAdmin/typings';
import { AdminRolesDtoRoleName } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import CorporateFareSharpIcon from '@mui/icons-material/CorporateFareSharp';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

export const navigationRoutes: NavigationRoute[] = [
  {
    path: PathRoutes.Dashboard,
    get title() {
      return i18n.t('admin_title_dashboard');
    },
    icon: HomeOutlinedIcon,
    access: [
      AdminRolesDtoRoleName.formalCaregiver,
      AdminRolesDtoRoleName.informalCaregiver,
      AdminRolesDtoRoleName.adminInstitution,
      AdminRolesDtoRoleName.superAdminInstitution,
    ],
  },
  {
    path: PathRoutes.Seniors,
    get title() {
      return i18n.t('admin_title_seniors');
    },
    icon: PersonOutlineOutlinedIcon,
    access: [AdminRolesDtoRoleName.formalCaregiver, AdminRolesDtoRoleName.informalCaregiver],
  },
  {
    path: PathRoutes.Institution,
    get title() {
      return i18n.t('admin_title_institution');
    },
    icon: CorporateFareSharpIcon,
    access: [AdminRolesDtoRoleName.superAdminInstitution, AdminRolesDtoRoleName.adminInstitution],
  },
  {
    path: PathRoutes.Settings,
    get title() {
      return i18n.t('admin_title_settings');
    },
    icon: SettingsOutlinedIcon,
    access: [AdminRolesDtoRoleName.formalCaregiver, AdminRolesDtoRoleName.informalCaregiver],
  },
  {
    path: PathRoutes.Support,
    get title() {
      return i18n.t('admin_title_support');
    },
    icon: ContactSupportOutlinedIcon,
    access: [
      AdminRolesDtoRoleName.formalCaregiver,
      AdminRolesDtoRoleName.informalCaregiver,
      AdminRolesDtoRoleName.adminInstitution,
      AdminRolesDtoRoleName.superAdminInstitution,
    ],
  },
];
