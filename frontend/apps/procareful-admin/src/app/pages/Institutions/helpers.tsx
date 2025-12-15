import { Link } from 'react-router-dom';
import type { TableProps } from 'antd';
import { cx } from 'antd-style';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import { tagColor, tagStatus } from '@ProcarefulAdmin/constants/tagStatus';
import { type GetInstitutionDto } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import { SearchParams } from '@Procareful/common/lib';
import { Tag, Text } from '@Procareful/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { styles } from './styles';

type ColumnDataParams = {
  pageSize: number;
  page?: number;
};

export const getColumnData = ({
  page = 1,
  pageSize,
}: ColumnDataParams): TableProps<GetInstitutionDto>['columns'] => [
  {
    title: '',
    dataIndex: 'index',
    key: 'index',
    width: '5%',
    render: (__, _, index) => <Text>{(page - 1) * pageSize + index + 1}</Text>,
  },
  {
    get title() {
      return i18n.t('admin_table_institution_name');
    },
    dataIndex: 'name',
    key: 'name',
    width: '75%',
  },
  {
    get title() {
      return i18n.t('admin_table_status');
    },
    dataIndex: 'status',
    key: 'status',
    width: '15%',
    render: (_, { status }) => {
      if (!status || !status.status_name) {
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
    width: '5%',

    render: (_, { id, superAdminId, name }) => {
      if (!id || !superAdminId) {
        return null;
      }

      const navigationConfig = {
        pathname: PathRoutes.InstitutionDetailsHeadAdmin,
        search: new URLSearchParams({
          [SearchParams.Id]: id.toString(),
          [SearchParams.SuperAdminId]: superAdminId.toString(),
          [SearchParams.PageTitle]: encodeURIComponent(name),
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
