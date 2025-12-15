import { Link } from 'react-router-dom';
import type { TableProps } from 'antd';
import { cx } from 'antd-style';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { tagColor, tagStatus } from '@ProcarefulAdmin/constants/tagStatus';
import { type GetFormalCaregiverDto } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import {
  EMPTY_VALUE_PLACEHOLDER,
  SearchParams,
  formatPhoneToDisplay,
} from '@Procareful/common/lib';
import { Tag, Text } from '@Procareful/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { styles } from '../styles';

export const columnData: TableProps<GetFormalCaregiverDto['formalCaregiver']>['columns'] = [
  {
    get title() {
      return i18n.t('admin_table_name');
    },
    dataIndex: 'first_name',
    key: 'first_name',
    width: '18%',
    render: (_, { first_name, last_name }) => <Text strong>{`${first_name} ${last_name}`}</Text>,
  },
  {
    get title() {
      return i18n.t('admin_table_email_address');
    },
    dataIndex: 'email_address',
    key: 'email_address',
    width: '26%',
  },
  {
    get title() {
      return i18n.t('admin_table_phone_number');
    },
    dataIndex: 'phone_number',
    key: 'phone_number',
    render: (_, { phone_number }) => <Text>{formatPhoneToDisplay(phone_number)}</Text>,
    width: '16%',
  },
  {
    get title() {
      return i18n.t('admin_table_role');
    },
    dataIndex: 'caregiver_roles',
    key: 'caregiver_roles',
    width: '23%',
    render: (_, { caregiver_roles }) => {
      if (!caregiver_roles?.length) {
        return <Text>{EMPTY_VALUE_PLACEHOLDER}</Text>;
      }

      return caregiver_roles.map(({ id, role_name }) => (
        <Tag className={cx(styles.tag)} key={id}>
          {i18n.t(`admin_title_caregiver_role_${role_name}`)}
        </Tag>
      ));
    },
  },
  {
    get title() {
      return i18n.t('admin_table_status');
    },
    dataIndex: 'status',
    key: 'status',
    width: '12%',

    render: (_, { status }) => {
      if (!status?.status_name) {
        return null;
      }

      return <Tag customColor={tagColor[status?.status_name]}>{tagStatus[status.status_name]}</Tag>;
    },
  },
  {
    title: '',
    dataIndex: 'action',
    key: 'action',
    align: 'right',
    width: '5%',
    render: (_, { id }) => {
      const queryParams = new URLSearchParams({
        [SearchParams.Id]: id.toString(),
      });

      const linkTo = `${PathRoutes.FormalCaregiverEdit}?${queryParams}`;

      return (
        <div className={cx(styles.editIconContainer)}>
          <Link to={linkTo}>
            <EditOutlinedIcon className={cx(styles.editIcon)} />
          </Link>
        </div>
      );
    },
  },
];
