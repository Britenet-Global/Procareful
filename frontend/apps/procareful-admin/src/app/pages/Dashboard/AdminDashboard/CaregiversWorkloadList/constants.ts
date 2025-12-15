import type { SelectProps } from 'antd';
import { AdminInstitutionControllerGetDashboardAdminViewSortOrder } from '@Procareful/common/api';

export const selectItems: SelectProps['options'] = [
  {
    label: 'shared_btn_ascending',
    value: AdminInstitutionControllerGetDashboardAdminViewSortOrder.ASC,
  },
  {
    label: 'shared_btn_descending',
    value: AdminInstitutionControllerGetDashboardAdminViewSortOrder.DESC,
  },
];

export const placeholderConfig = {
  title: 'admin_inf_no_data_yet',
  description: 'admin_inf_no_caregivers_added',
};
