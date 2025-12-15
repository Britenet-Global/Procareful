import type { SelectProps } from 'antd';

export const selectItems: SelectProps['options'] = [
  {
    label: 'admin_btn_top_to_bottom',
    value: 'DESC',
  },
  {
    label: 'admin_btn_bottom_to_top',
    value: 'ASC',
  },
];

export const placeholderConfig = {
  title: 'admin_inf_no_data_yet',
  description: 'admin_inf_no_performance_seniors_data',
};
