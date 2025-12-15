import { type Dayjs } from 'dayjs';
import type { ComponentProps } from 'react';
import type { z } from 'zod';
import type { Button, Checkbox, Input, TableProps } from 'antd';
import type { PathRoutes } from '@ProcarefulAdmin/constants';
import type { AssignChallengeType } from '@ProcarefulAdmin/pages/AssignActivities/types';
import type { loginSchema } from '@ProcarefulAdmin/utils/validationSchemas';
import type {
  StatusStatusName,
  AdminRolesDtoRoleName,
  GetSuperInstitutionAdminDtoStatusStatusName,
  AdminInstitutionControllerGetFormalCaregiversFilterStatusStatusName,
  AdminInstitutionControllerGetInformalCaregiversFilterStatusStatusName,
  AdminInstitutionControllerGetUsersFilterStatusStatusName,
  DayDtoName,
  AdminRolesDto,
  RoleDto,
  GenerateSchedulesDtoRecommendedLevel,
} from '@Procareful/common/api';
import { type SvgIconComponent } from '@mui/icons-material';

export type TableUserCell = {
  id: string;
  imageUrl: string;
  userName: string;
  phoneNumber: string;
};

export type ChartProps = {
  chartTitle: string;
  chartSubtitle: string;
  chartDescription?: string;
};

export type ChartTypes = 'bar' | 'line' | 'column' | 'circular';

export type SeniorActivity = {
  title: string;
  exerciseType: string;
  type: 'physical' | 'cognitive' | 'social';
  duration?: string;
  id: string;
};

export type NoteTitle = {
  header: string;
  attachments?: number;
};

export type TableSkeletonColumnsType = {
  key: string;
};

export type BannerNoteType = 'info' | 'success' | 'warning';

export type BannerNoteIconType = 'check' | 'exclamation' | 'info' | 'warning';

export type BannerNote = {
  type: BannerNoteType;
  informalCaregiver?: boolean;
  title: string;
  description?: string;
  iconType: BannerNoteIconType;
};

export type LoginData = z.infer<typeof loginSchema>;

export type TableComponentProps = {
  rowData: TableProps['dataSource'];
  loading?: boolean;
};

type BaseButtonProps = ComponentProps<typeof Button> & {
  title: string;
};

type LinkButtonProps = BaseButtonProps & {
  buttonType?: 'link';
  navigateTo: PathRoutes;
};

type OtherButtonProps = BaseButtonProps & {
  buttonType?: 'upload' | 'default';
  navigateTo?: never;
};

export type TableHeaderButtonProps = LinkButtonProps | OtherButtonProps;

export type CheckboxProps = ComponentProps<typeof Checkbox>;

export type SearchProps = ComponentProps<typeof Input.Search>;

export type RedirectionProps = {
  linkTo: PathRoutes;
  title: string;
};

export type SuperAdmin = {
  emailAddress: string;
  phoneNumber: string;
  adminId: string;
};

export type Institution = {
  id: string;
  registration: string;
  status: StatusStatusName;
  name: string;
  city: string;
  street: string;
  building: string;
  flat: string;
  zipCode: string;
  phoneNumber: string;
  emailAddress: string;
};

export type SuperAdminDetails = {
  superAdmin: SuperAdmin;
  institution: Institution;
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role?: AdminRolesDtoRoleName;
  dateOfBirth: Dayjs;
  phoneNumber: string;
  emailAddress: string;
  street: string;
  building: string;
  flat: string;
  zipCode: string;
  status: StatusStatusName;
};

type WeekdayAvailability = [string, string];

export type WorkingDaysWithHours = Record<DayDtoName, WeekdayAvailability>;

export type FormattedWeekdayAvailability = [Dayjs, Dayjs];

export type FormattedWorkingDaysWithHours = Record<DayDtoName, FormattedWeekdayAvailability>;

export type Route = {
  paths: PathRoutes[];
  element: JSX.Element;
  access: AdminRolesDtoRoleName[];
};

export type NavigationRoute = {
  path: PathRoutes;
  icon: SvgIconComponent;
  title: string;
  access: AdminRolesDtoRoleName[];
};

export type UserStatus =
  | StatusStatusName
  | GetSuperInstitutionAdminDtoStatusStatusName
  | AdminInstitutionControllerGetFormalCaregiversFilterStatusStatusName
  | AdminInstitutionControllerGetInformalCaregiversFilterStatusStatusName
  | AdminInstitutionControllerGetUsersFilterStatusStatusName;

export type EnvVariables = {
  VITE_CELLPHONES_PREFIXES: string[];
};

export type AdminRoles = AdminRolesDto[] | RoleDto[];

export type OnboardingStep = {
  id: string;
  title: string;
  subtitle: string;
  completed: boolean;
  stepOrder: string;
  redirectTo: PathRoutes;
};

export type StepKeysOnly<T> = {
  [K in keyof T as K extends `step${number}` ? K : never]: T[K];
};

export type ActivityType = GenerateSchedulesDtoRecommendedLevel | 'custom';

export type AssignActivityTile = ActivityType | AssignChallengeType;

export type PaginationTableProps = TableProps['pagination'] & {
  paginationPosition?: 'below' | 'bottom';
};

export type ActivityDescriptionType =
  | 'physicalActivities'
  | 'walking'
  | 'breathingExercises'
  | 'cognitiveGames'
  | 'personalGrowth';

export type PartialUpdateCaregiverProps<T> = T & {
  caregiverId: number;
  onSuccess: () => void;
};

export type SupportingContactUserModalData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  id?: number;
};
