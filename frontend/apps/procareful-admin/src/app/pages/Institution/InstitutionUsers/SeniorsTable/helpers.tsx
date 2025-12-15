import { Link } from 'react-router-dom';
import type { TableProps } from 'antd';
import { cx } from 'antd-style';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { tagColor, tagStatus } from '@ProcarefulAdmin/constants/tagStatus';
import { type GetUserDto } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import {
  EMPTY_VALUE_PLACEHOLDER,
  SearchParams,
  formatPhoneToDisplay,
} from '@Procareful/common/lib';
import { Tag, Text } from '@Procareful/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { styles } from '../styles';

export const columnData: TableProps<GetUserDto['senior']>['columns'] = [
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
    width: '26%',
    render: (_, { email_address }) => {
      if (!email_address) {
        return EMPTY_VALUE_PLACEHOLDER;
      }

      return email_address;
    },
  },
  {
    get title() {
      return i18n.t('admin_table_phone_number');
    },
    dataIndex: 'phone_number',
    key: 'phone_number',
    width: '16%',
    render: (_, { phone_number }) => {
      if (!phone_number) {
        return EMPTY_VALUE_PLACEHOLDER;
      }

      return <Text>{formatPhoneToDisplay(phone_number)}</Text>;
    },
  },
  {
    get title() {
      return i18n.t('admin_table_added_by');
    },
    dataIndex: 'created_by',
    key: 'created_by',
    width: '23%',
    render: (_, { created_by }) => {
      if (!created_by?.first_name || !created_by?.last_name) {
        return null;
      }

      return <Text>{`${created_by.first_name} ${created_by.last_name}`}</Text>;
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
      if (!id) {
        return null;
      }

      const queryParams = new URLSearchParams({
        [SearchParams.Id]: id.toString(),
      });

      const linkTo = `${PathRoutes.SeniorEditInstitution}?${queryParams}`;

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
