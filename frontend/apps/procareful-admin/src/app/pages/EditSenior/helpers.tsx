import { type TableProps } from 'antd';
import { cx } from 'antd-style';
import { type GetCaregiverDto } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { EMPTY_VALUE_PLACEHOLDER } from '@Procareful/common/lib';
import { Tag, Text } from '@Procareful/ui';
import PersonRemoveAlt1OutlinedIcon from '@mui/icons-material/PersonRemoveAlt1Outlined';
import { styles } from './styles';

export const getColumnData = (
  handleRemoveAssignmentClick: (rowData: GetCaregiverDto) => void
): TableProps<GetCaregiverDto>['columns'] => [
  {
    get title() {
      return i18n.t('admin_table_name');
    },
    key: 'name',
    width: '45%',
    render: (_, { first_name, last_name }) => <Text strong>{`${first_name} ${last_name}`}</Text>,
  },
  {
    get title() {
      return i18n.t('admin_table_role');
    },
    key: 'role',
    width: '45%',
    render: (_, { caregiver_roles }) => {
      if (!caregiver_roles || caregiver_roles.length === 0) {
        return EMPTY_VALUE_PLACEHOLDER;
      }

      return caregiver_roles.map(({ id, role_name }) => (
        <Tag className={cx(styles.tag)} key={id}>
          {i18n.t(`admin_title_caregiver_role_${role_name}`)}
        </Tag>
      ));
    },
  },
  {
    title: '',
    dataIndex: 'action',
    key: 'action',
    align: 'right',
    width: '10%',
    render: (_, record) => (
      <PersonRemoveAlt1OutlinedIcon
        className={cx(styles.editIcon)}
        onClick={() => handleRemoveAssignmentClick(record)}
      />
    ),
  },
];
