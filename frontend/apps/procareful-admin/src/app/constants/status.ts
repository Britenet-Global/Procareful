import { type SelectProps } from 'antd';
import { StatusStatusName } from '@Procareful/common/api';

export const selectStatusOptions: SelectProps['options'] = [
  {
    label: 'admin_form_status_active',
    value: StatusStatusName.active,
  },
  {
    label: 'admin_form_status_created',
    value: StatusStatusName.created,
  },
  {
    label: 'admin_form_status_inactive',
    value: StatusStatusName.inactive,
  },
];
