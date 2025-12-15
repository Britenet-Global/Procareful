import { Link } from 'react-router-dom';
import type { TableProps } from 'antd';
import { cx } from 'antd-style';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { tagColor, tagStatus } from '@ProcarefulAdmin/constants/tagStatus';
import type { GetInformalCaregiverDto } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { formatPhoneToDisplay, SearchParams } from '@Procareful/common/lib';
import { Tag, Text } from '@Procareful/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { styles } from '../styles';

export const columnData: TableProps<GetInformalCaregiverDto['informalCaregiver']>['columns'] = [
  {
    get title() {
      return i18n.t('admin_table_name');
    },
    dataIndex: 'name',
    key: 'name',
    width: '25%',
    render: (_, { first_name, last_name }) => <Text strong>{`${first_name} ${last_name}`}</Text>,
  },
  {
    get title() {
      return i18n.t('admin_table_email_address');
    },
    dataIndex: 'email_address',
    key: 'email_address',
    width: '28%',
  },
  {
    get title() {
      return i18n.t('admin_table_phone_number');
    },
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    width: '22%',
    render: (_, { phone_number }) => <Text>{formatPhoneToDisplay(phone_number)}</Text>,
  },
  {
    get title() {
      return i18n.t('admin_table_status');
    },
    dataIndex: 'status',
    key: 'status',
    width: '15%',
    render: (_, { status }) => {
      if (!status?.status_name) {
        return null;
      }

      return <Tag customColor={tagColor[status.status_name]}>{tagStatus[status.status_name]}</Tag>;
    },
  },
  {
    title: '',
    dataIndex: 'action',
    key: 'action',
    align: 'right',
    width: '10%',

    render: (_, { id }) => {
      if (!id) {
        return null;
      }

      const queryParams = new URLSearchParams({
        [SearchParams.Id]: id.toString(),
      });
      const linkTo = `${PathRoutes.InformalCaregiverEdit}?${queryParams}`;

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
