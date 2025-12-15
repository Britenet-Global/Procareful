import ActivateSeniorApp from '@ProcarefulAdmin/pages/ActivateSeniorApp';
import AddFormalCaregiver from '@ProcarefulAdmin/pages/AddFormalCaregiver';
import AddInformalCaregiver from '@ProcarefulAdmin/pages/AddInformalCaregiver';
import AddOrChangeInstitutionOwner from '@ProcarefulAdmin/pages/AddOrChangeInstitutionOwner';
import AddSenior from '@ProcarefulAdmin/pages/AddSenior';
import AddSeniorAssessment from '@ProcarefulAdmin/pages/AddSeniorAssessment';
import DownloadAssessmentReport from '@ProcarefulAdmin/pages/AddSeniorAssessment/DownloadAssessmentReport';
import AddSeniorEntry from '@ProcarefulAdmin/pages/AddSeniorEntry';
import AssignActivities from '@ProcarefulAdmin/pages/AssignActivities';
import BuildCustomSchedule from '@ProcarefulAdmin/pages/BuildCustomSchedule';
import Caregivers from '@ProcarefulAdmin/pages/Caregivers';
import Dashboard from '@ProcarefulAdmin/pages/Dashboard';
import EditFormalCaregiver from '@ProcarefulAdmin/pages/EditFormalCaregiver';
import EditInformalCaregiver from '@ProcarefulAdmin/pages/EditInformalCaregiver';
import EditSenior from '@ProcarefulAdmin/pages/EditSenior';
import ForgotPassword from '@ProcarefulAdmin/pages/ForgotPassword';
import ForgotPasswordConfirmation from '@ProcarefulAdmin/pages/ForgotPasswordConfirmation';
import FormalCaregiverProfile from '@ProcarefulAdmin/pages/FormalCaregiverProfile';
import Institution from '@ProcarefulAdmin/pages/Institution';
import InstitutionAdmins from '@ProcarefulAdmin/pages/Institution/InstitutionAdmins';
import AddInstitutionAdmin from '@ProcarefulAdmin/pages/Institution/InstitutionAdmins/AddInstitutionAdmin';
import EditInstitutionAdmin from '@ProcarefulAdmin/pages/Institution/InstitutionAdmins/EditInstitutionAdmin';
import InstitutionDetails from '@ProcarefulAdmin/pages/Institution/InstitutionDetails';
import InstitutionUsers from '@ProcarefulAdmin/pages/Institution/InstitutionUsers';
import SupportManagement from '@ProcarefulAdmin/pages/Institution/SupportManagement';
import InstitutionDetailsForHeadAdmin from '@ProcarefulAdmin/pages/InstitutionDetails';
import Institutions from '@ProcarefulAdmin/pages/Institutions';
import Login from '@ProcarefulAdmin/pages/Login';
import LoginConfirmation from '@ProcarefulAdmin/pages/LoginConfirmation';
import ManageYourAccount from '@ProcarefulAdmin/pages/ManageYourAccount';
import NotFound from '@ProcarefulAdmin/pages/NotFound/NotFound';
import NotificationsCenter from '@ProcarefulAdmin/pages/NotificationsCenter';
import OnboardingEntry from '@ProcarefulAdmin/pages/OnboardingEntry';
import ResetPassword from '@ProcarefulAdmin/pages/ResetPassword';
import ResetPasswordConfirmation from '@ProcarefulAdmin/pages/ResetPasswordConfirmation';
import SeniorProfile from '@ProcarefulAdmin/pages/SeniorProfile';
import SeniorSupportingContacts from '@ProcarefulAdmin/pages/SeniorSupportingContacts';
import Seniors from '@ProcarefulAdmin/pages/Seniors';
import Settings from '@ProcarefulAdmin/pages/Settings';
import NotificationsPreferences from '@ProcarefulAdmin/pages/Settings/NotificationsPreferences';
import ProfessionalProfile from '@ProcarefulAdmin/pages/Settings/ProfessionalProfile';
import Signup from '@ProcarefulAdmin/pages/Signup';
import Support from '@ProcarefulAdmin/pages/Support';
import Trainings from '@ProcarefulAdmin/pages/Trainings';
import { type Route } from '@ProcarefulAdmin/typings';
import { AdminRolesDtoRoleName } from '@Procareful/common/api';
import { PathRoutes } from './enums';

const allRoles = [
  AdminRolesDtoRoleName.formalCaregiver,
  AdminRolesDtoRoleName.informalCaregiver,
  AdminRolesDtoRoleName.adminInstitution,
  AdminRolesDtoRoleName.superAdminInstitution,
  AdminRolesDtoRoleName.headAdmin,
];

export const protectedRoutes: Route[] = [
  {
    paths: [PathRoutes.Dashboard],
    element: <Dashboard />,
    access: [
      AdminRolesDtoRoleName.formalCaregiver,
      AdminRolesDtoRoleName.informalCaregiver,
      AdminRolesDtoRoleName.adminInstitution,
      AdminRolesDtoRoleName.superAdminInstitution,
    ],
  },
  {
    paths: [PathRoutes.Seniors],
    element: <Seniors />,
    access: [AdminRolesDtoRoleName.formalCaregiver, AdminRolesDtoRoleName.informalCaregiver],
  },
  {
    paths: [PathRoutes.Trainings],
    element: <Trainings />,
    access: [AdminRolesDtoRoleName.formalCaregiver],
  },
  {
    paths: [PathRoutes.InformalCaregivers],
    element: <Caregivers />,
    access: [AdminRolesDtoRoleName.formalCaregiver],
  },
  {
    paths: [PathRoutes.FormalCaregivers],
    element: <Caregivers />,
    access: [AdminRolesDtoRoleName.informalCaregiver],
  },
  {
    paths: [PathRoutes.Support],
    element: <Support />,
    access: [
      AdminRolesDtoRoleName.formalCaregiver,
      AdminRolesDtoRoleName.informalCaregiver,
      AdminRolesDtoRoleName.adminInstitution,
      AdminRolesDtoRoleName.superAdminInstitution,
    ],
  },
  {
    paths: [PathRoutes.Institutions],
    element: <Institutions />,
    access: [AdminRolesDtoRoleName.headAdmin],
  },
  {
    paths: [PathRoutes.InstitutionDetailsHeadAdmin],
    element: <InstitutionDetailsForHeadAdmin />,
    access: [AdminRolesDtoRoleName.headAdmin],
  },
  {
    paths: [PathRoutes.ChangeInstitutionOwner, PathRoutes.InstitutionsAdd],
    element: <AddOrChangeInstitutionOwner />,
    access: [AdminRolesDtoRoleName.headAdmin],
  },
  {
    paths: [PathRoutes.Institution],
    element: <Institution />,
    access: [AdminRolesDtoRoleName.adminInstitution, AdminRolesDtoRoleName.superAdminInstitution],
  },
  {
    paths: [PathRoutes.InstitutionDetails],
    element: <InstitutionDetails />,
    access: [AdminRolesDtoRoleName.adminInstitution, AdminRolesDtoRoleName.superAdminInstitution],
  },
  {
    paths: [PathRoutes.SupportManagement],
    element: <SupportManagement />,
    access: [AdminRolesDtoRoleName.adminInstitution, AdminRolesDtoRoleName.superAdminInstitution],
  },
  {
    paths: [PathRoutes.InstitutionUsers],
    element: <InstitutionUsers />,
    access: [AdminRolesDtoRoleName.adminInstitution, AdminRolesDtoRoleName.superAdminInstitution],
  },
  {
    paths: [PathRoutes.InstitutionAdmins],
    element: <InstitutionAdmins />,
    access: [AdminRolesDtoRoleName.adminInstitution, AdminRolesDtoRoleName.superAdminInstitution],
  },
  {
    paths: [PathRoutes.NotificationPreferences],
    element: <NotificationsPreferences />,
    access: [AdminRolesDtoRoleName.formalCaregiver, AdminRolesDtoRoleName.informalCaregiver],
  },
  {
    paths: [PathRoutes.SeniorEditInstitution],
    element: <EditSenior />,
    access: [AdminRolesDtoRoleName.adminInstitution, AdminRolesDtoRoleName.superAdminInstitution],
  },
  {
    paths: [PathRoutes.SeniorEdit],
    element: <EditSenior />,
    access: [AdminRolesDtoRoleName.informalCaregiver],
  },
  {
    paths: [PathRoutes.SeniorAddEntry],
    element: <AddSeniorEntry />,
    access: [AdminRolesDtoRoleName.formalCaregiver],
  },
  {
    paths: [PathRoutes.SeniorAddPersonalInfo],
    element: <AddSenior />,
    access: [AdminRolesDtoRoleName.formalCaregiver],
  },
  {
    paths: [PathRoutes.SeniorProfile],
    element: <SeniorProfile />,
    access: [AdminRolesDtoRoleName.formalCaregiver, AdminRolesDtoRoleName.informalCaregiver],
  },
  {
    paths: [PathRoutes.SeniorAddConditionAssessment],
    element: <AddSeniorAssessment />,
    access: [AdminRolesDtoRoleName.formalCaregiver],
  },
  {
    paths: [PathRoutes.SeniorDownloadAssessmentReport],
    element: <DownloadAssessmentReport />,
    access: [AdminRolesDtoRoleName.formalCaregiver],
  },
  {
    paths: [PathRoutes.SeniorAddSupportingContacts],
    element: <SeniorSupportingContacts />,
    access: [AdminRolesDtoRoleName.formalCaregiver],
  },
  {
    paths: [PathRoutes.SeniorAddAssignActivities, PathRoutes.SeniorEditProfileAssignActivities],
    element: <AssignActivities />,
    access: [AdminRolesDtoRoleName.formalCaregiver],
  },
  {
    paths: [PathRoutes.FormalCaregiverEdit],
    element: <EditFormalCaregiver />,
    access: [AdminRolesDtoRoleName.adminInstitution, AdminRolesDtoRoleName.superAdminInstitution],
  },
  {
    paths: [PathRoutes.FormalCaregiverAdd],
    element: <AddFormalCaregiver />,
    access: [AdminRolesDtoRoleName.adminInstitution, AdminRolesDtoRoleName.superAdminInstitution],
  },
  {
    paths: [PathRoutes.AddInstitutionAdmin],
    element: <AddInstitutionAdmin />,
    access: [AdminRolesDtoRoleName.superAdminInstitution],
  },
  {
    paths: [PathRoutes.EditInstitutionAdmin],
    element: <EditInstitutionAdmin />,
    access: [AdminRolesDtoRoleName.superAdminInstitution],
  },
  {
    paths: [PathRoutes.InformalCaregiverAdd],
    element: <AddInformalCaregiver />,
    access: [AdminRolesDtoRoleName.adminInstitution, AdminRolesDtoRoleName.superAdminInstitution],
  },
  {
    paths: [PathRoutes.InformalCaregiverEdit],
    element: <EditInformalCaregiver />,
    access: [AdminRolesDtoRoleName.adminInstitution, AdminRolesDtoRoleName.superAdminInstitution],
  },
  {
    paths: [PathRoutes.Settings],
    element: <Settings />,
    access: [AdminRolesDtoRoleName.formalCaregiver, AdminRolesDtoRoleName.informalCaregiver],
  },
  {
    paths: [PathRoutes.ActivateSeniorApp],
    element: <ActivateSeniorApp />,
    access: [AdminRolesDtoRoleName.informalCaregiver, AdminRolesDtoRoleName.formalCaregiver],
  },
  {
    paths: [PathRoutes.ManageYourProfile],
    element: <ManageYourAccount />,
    access: [
      AdminRolesDtoRoleName.formalCaregiver,
      AdminRolesDtoRoleName.informalCaregiver,
      AdminRolesDtoRoleName.adminInstitution,
      AdminRolesDtoRoleName.superAdminInstitution,
      AdminRolesDtoRoleName.headAdmin,
    ],
  },
  {
    paths: [PathRoutes.ProfessionalProfile],
    element: <ProfessionalProfile />,
    access: [AdminRolesDtoRoleName.formalCaregiver],
  },
  {
    paths: [PathRoutes.NotificationsCenter],
    element: <NotificationsCenter />,
    access: [AdminRolesDtoRoleName.formalCaregiver, AdminRolesDtoRoleName.informalCaregiver],
  },
  {
    paths: [PathRoutes.SeniorBuildCustomSchedule, PathRoutes.SeniorEditProfileEditSchedule],
    element: <BuildCustomSchedule />,
    access: [AdminRolesDtoRoleName.formalCaregiver],
  },
  {
    paths: [PathRoutes.SeniorFormalCaregiverProfile],
    element: <FormalCaregiverProfile />,
    access: [AdminRolesDtoRoleName.formalCaregiver, AdminRolesDtoRoleName.informalCaregiver],
  },
];

export const publicRoutes: Route[] = [
  {
    paths: [PathRoutes.Login],
    element: <Login />,
    access: allRoles,
  },
  {
    paths: [PathRoutes.ForgotPassword],
    element: <ForgotPassword />,
    access: allRoles,
  },
  {
    paths: [PathRoutes.ForgotPasswordConfirmation],
    element: <ForgotPasswordConfirmation />,
    access: allRoles,
  },
  {
    paths: [PathRoutes.LoginConfirmation],
    element: <LoginConfirmation />,
    access: allRoles,
  },
  {
    paths: [PathRoutes.Signup],
    element: <Signup />,
    access: allRoles,
  },
  {
    paths: [PathRoutes.NotFound],
    element: <NotFound />,
    access: allRoles,
  },
  {
    paths: [PathRoutes.ResetPassword],
    element: <ResetPassword />,
    access: allRoles,
  },
  {
    paths: [PathRoutes.ResetPasswordConfirmation],
    element: <ResetPasswordConfirmation />,
    access: allRoles,
  },
];

export const onboardingEntryRoute = {
  path: PathRoutes.OnboardingEntry,
  element: <OnboardingEntry />,
  access: [
    AdminRolesDtoRoleName.formalCaregiver,
    AdminRolesDtoRoleName.informalCaregiver,
    AdminRolesDtoRoleName.adminInstitution,
    AdminRolesDtoRoleName.superAdminInstitution,
  ],
};
