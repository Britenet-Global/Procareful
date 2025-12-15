import { Link } from 'react-router-dom';
import type { TableProps } from 'antd';
import { cx } from 'antd-style';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import type { UserDto } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { formatPhoneToDisplay, SearchParams } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { styles } from './styles';

export const columnsData: TableProps<UserDto>['columns'] = [
  {
    get title() {
      return i18n.t('admin_table_name');
    },
    key: 'fullName',
    width: '45%',
    render: (_, { first_name, last_name }) => <Text strong>{`${first_name} ${last_name}`}</Text>,
  },
  {
    get title() {
      return i18n.t('admin_table_phone_number');
    },
    key: 'phoneNumber',
    render: (_, { phone_number }) => <Text>{formatPhoneToDisplay(phone_number)}</Text>,
    width: '45%',
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

      const navigationConfig = {
        pathname: PathRoutes.SeniorEditInstitution,
        search: new URLSearchParams({
          [SearchParams.Id]: id.toString(),
        }).toString(),
      };

      return (
        <div className={cx(styles.editIconContainer)}>
          <Link to={navigationConfig}>
            <EditOutlinedIcon className={cx(styles.editIcon)} />
          </Link>
        </div>
      );
    },
  },
];
