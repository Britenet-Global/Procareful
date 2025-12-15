import { type TabsProps } from 'antd';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { i18n } from '@Procareful/common/i18n';
import CarePlan from './tabs/CarePlanTab';
import DetailsTab from './tabs/DetailsTab';
import DocumentsTab from './tabs/DocumentsTab';
import FormalCaregiverTab from './tabs/FormalCaregiverTab';
import NotesTab from './tabs/NotesTab';
import PerformanceTab from './tabs/PerformanceTab';
import SupportingContactsTab from './tabs/SupportingContactsTab';

export enum BannerType {
  NoAssessment,
  NoActivities,
  PerformanceWarning,
}

type BannerContent = {
  title: string;
  subtitle: string;
  buttonText: string;
  redirectTo: PathRoutes;
};

export const bannerConfig: Record<BannerType, BannerContent> = {
  [BannerType.NoAssessment]: {
    get title() {
      return i18n.t('admin_title_assessment_not_completed');
    },
    get subtitle() {
      return i18n.t('admin_inf_assessment_not_completed_subtitle');
    },
    get buttonText() {
      return i18n.t('admin_btn_start_assessment');
    },
    redirectTo: PathRoutes.SeniorAddEntry,
  },
  [BannerType.NoActivities]: {
    get title() {
      return i18n.t('admin_title_activities_not_completed');
    },
    get subtitle() {
      return i18n.t('admin_inf_activities_not_completed_subtitle');
    },
    get buttonText() {
      return i18n.t('admin_btn_assign_activities');
    },
    redirectTo: PathRoutes.SeniorAddAssignActivities,
  },
  [BannerType.PerformanceWarning]: {
    get title() {
      return i18n.t('admin_title_performance_warning');
    },
    get subtitle() {
      return i18n.t('admin_inf_performance_warning_subtitle');
    },
    get buttonText() {
      return i18n.t('admin_btn_start_assessment');
    },
    redirectTo: PathRoutes.SeniorAddEntry,
  },
};

export const formalCaregiverTabItems: TabsProps['items'] = [
  {
    key: 'admin_btn_performance',
    label: 'admin_btn_performance',
    children: <PerformanceTab />,
  },
  {
    key: 'admin_btn_notes',
    label: 'admin_btn_notes',
    children: <NotesTab />,
  },
  {
    key: 'admin_title_care_plan',
    label: 'admin_title_care_plan',
    children: <CarePlan />,
  },
  {
    key: 'admin_title_stepper_senior_details',
    label: 'admin_title_stepper_senior_details',
    children: <DetailsTab />,
  },
  {
    key: 'admin_title_supporting_contacts',
    label: 'admin_title_supporting_contacts',
    children: <SupportingContactsTab />,
  },
  {
    key: 'admin_title_formal_caregivers',
    label: 'admin_title_formal_caregivers',
    children: <FormalCaregiverTab />,
  },
  {
    key: 'admin_btn_documents',
    label: 'admin_btn_documents',
    children: <DocumentsTab />,
  },
];

export const informalCaregiverTabItems: TabsProps['items'] = [
  {
    key: 'admin_btn_performance',
    label: 'admin_btn_performance',
    children: <PerformanceTab />,
  },
  {
    key: 'admin_btn_notes',
    label: 'admin_btn_notes',
    children: <NotesTab />,
  },
  {
    key: 'admin_title_care_plan',
    label: 'admin_title_care_plan',
    children: <CarePlan />,
  },
  {
    key: 'admin_title_stepper_senior_details',
    label: 'admin_title_stepper_senior_details',
    children: <DetailsTab />,
  },
  {
    key: 'admin_title_formal_caregivers',
    label: 'admin_title_formal_caregivers',
    children: <FormalCaregiverTab />,
  },
];
