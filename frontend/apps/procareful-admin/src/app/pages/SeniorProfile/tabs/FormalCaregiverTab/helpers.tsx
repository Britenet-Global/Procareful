import { Link } from 'react-router-dom';
import { type TableProps } from 'antd';
import { cx } from 'antd-style';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { type GetCaregiverDto } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { EMPTY_VALUE_PLACEHOLDER, SearchParams } from '@Procareful/common/lib';
import { Tag, Text } from '@Procareful/ui';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { styles } from './styles';

export const columnsData: TableProps<GetCaregiverDto>['columns'] = [
  {
    get title() {
      return i18n.t('admin_table_name');
    },
    key: 'name',
    width: '31%',
    render: (_, { first_name, last_name }) => <Text strong>{`${first_name} ${last_name}`}</Text>,
  },
  {
    get title() {
      return i18n.t('admin_table_email_address');
    },
    key: 'email_address',
    width: '31%',
    render: (_, { email_address }) => email_address ?? EMPTY_VALUE_PLACEHOLDER,
  },
  {
    get title() {
      return i18n.t('admin_table_role');
    },
    key: 'role',
    width: '31%',
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
    width: '6%',
    render: (_, { id }) => {
      const navigationConfig = {
        pathname: PathRoutes.SeniorFormalCaregiverProfile,
        search: new URLSearchParams({
          [SearchParams.Id]: id.toString(),
        }).toString(),
      };

      return (
        <Link to={navigationConfig}>
          <ChevronRightIcon className={cx(styles.chevronIcon)} />
        </Link>
      );
    },
  },
];
