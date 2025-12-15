import { i18n } from '@Procareful/common/i18n';

type LegendElements = {
  id: string;
  text: string;
  className: 'firstElement' | 'secondElement' | 'thirdElement' | 'fourthElement' | 'fifthElement';
};

export const legendElements: LegendElements[] = [
  {
    id: '1',
    get text() {
      return i18n.t('admin_inf_heatmap_legend_0');
    },
    className: 'firstElement',
  },
  {
    id: '2',
    get text() {
      return i18n.t('admin_inf_heatmap_legend_1');
    },
    className: 'secondElement',
  },
  {
    id: '3',
    get text() {
      return i18n.t('admin_inf_heatmap_legend_2');
    },
    className: 'thirdElement',
  },
  {
    id: '4',
    get text() {
      return i18n.t('admin_inf_heatmap_legend_3');
    },
    className: 'fourthElement',
  },
  {
    id: '5',
    get text() {
      return i18n.t('admin_inf_heatmap_legend_4');
    },
    className: 'fifthElement',
  },
];
