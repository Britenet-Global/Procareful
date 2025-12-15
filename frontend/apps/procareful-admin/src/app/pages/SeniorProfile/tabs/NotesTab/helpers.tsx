import dayjs from 'dayjs';
import type { MenuProps, TableProps } from 'antd';
import { cx } from 'antd-style';
import { CategoryType } from '@ProcarefulAdmin/constants';
import {
  GetNoteCategoryDtoCategoryName,
  type GetNoteCategoryDto,
  type GetNotesDto,
} from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { EMPTY_VALUE_PLACEHOLDER, TimeFormat } from '@Procareful/common/lib';
import { Text, Tag } from '@Procareful/ui';
import NoteTitleCell from './NoteTitleCell';
import { styles } from './styles';

const categoryLabels: Record<GetNoteCategoryDtoCategoryName, string> = {
  [GetNoteCategoryDtoCategoryName.medical_consultation_required]:
    'admin_inf_label_medical_consultation_required',
  [GetNoteCategoryDtoCategoryName.medical_history]: 'admin_inf_label_medical_history',
  [GetNoteCategoryDtoCategoryName.monitoring_visit_request]:
    'admin_inf_label_monitoring_visit_request',
  [GetNoteCategoryDtoCategoryName.required_purchases]: 'admin_inf_label_required_purchases',
  [GetNoteCategoryDtoCategoryName.other_services_required]:
    'admin_inf_label_other_services_required',
};

export const renderCategoryLabels = (category: GetNoteCategoryDto[]) =>
  category.map(({ id, category_name }) => (
    <Tag className={cx(styles.tag)} key={id}>
      <Text className={cx(styles.tagText)}>{i18n.t(categoryLabels[category_name])}</Text>
    </Tag>
  ));

export const columnData: TableProps<GetNotesDto>['columns'] = [
  {
    get title() {
      return i18n.t('admin_table_title');
    },
    dataIndex: 'title',
    key: 'title',
    width: '40%',
    render: (_, { title, attachments }) => (
      <NoteTitleCell title={title} attachmentsLength={attachments.length} />
    ),
  },
  {
    get title() {
      return i18n.t('admin_table_date');
    },
    dataIndex: 'date',
    key: 'date',
    width: '15%',
    render: (_, { created_at }) => <Text>{dayjs(created_at).format(TimeFormat.DATE_FORMAT)}</Text>,
  },
  {
    get title() {
      return i18n.t('admin_table_notes_author');
    },
    dataIndex: 'author',
    key: 'author',
    width: '15%',
    render: (_, { author }) => {
      const { first_name, last_name } = author;

      return <Text>{`${first_name} ${last_name}`}</Text>;
    },
  },
  {
    get title() {
      return i18n.t('admin_form_note_category');
    },
    dataIndex: 'category',
    key: 'category',
    width: '30%',
    render: (_, { category, priority }) => {
      if (!category.length && !priority) {
        return <Text>{EMPTY_VALUE_PLACEHOLDER}</Text>;
      }

      return (
        <div>
          {renderCategoryLabels(category)}
          {priority && <Tag customColor="red">{i18n.t('admin_table_priority')}</Tag>}
        </div>
      );
    },
  },
];

export const categorySelectOptions = Object.keys(GetNoteCategoryDtoCategoryName).map(key => ({
  label: categoryLabels[key as keyof typeof GetNoteCategoryDtoCategoryName],
  value: key as keyof typeof GetNoteCategoryDtoCategoryName,
}));

export const categoryDropdownData: MenuProps['items'] = Object.keys(CategoryType).map(key => ({
  key,
  label: CategoryType[key as keyof typeof CategoryType],
}));
