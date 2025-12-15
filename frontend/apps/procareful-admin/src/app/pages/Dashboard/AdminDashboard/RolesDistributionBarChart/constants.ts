import { type BarConfig } from '@ant-design/plots';
import { i18n } from '@Procareful/common/i18n';
import { globalStyles } from '@Procareful/ui';

// Value below which the label is displayed outside the bar
const SMALL_ASSIGNED_SENIORS_THRESHOLD = 5;

export const config: BarConfig = {
  yField: 'value',
  xField: 'name',
  label: {
    text: 'value',
    style: {
      fill: 'black',
      dx: (d: { value: number }) => (+d.value > SMALL_ASSIGNED_SENIORS_THRESHOLD ? -15 : 15),
    },
  },
  tooltip: null,
  colorField: globalStyles.themeColors.colorPrimaryHover,
  axis: {
    y: null,
  },
};

export const placeholderConfig = {
  get title() {
    return i18n.t('admin_inf_no_info_yet');
  },
  get description() {
    return i18n.t('admin_inf_no_caregivers_added');
  },
};
