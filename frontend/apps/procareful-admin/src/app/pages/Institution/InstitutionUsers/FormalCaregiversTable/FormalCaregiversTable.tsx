import { keepPreviousData } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { SelectProps } from 'antd';
import TableLayout from '@ProcarefulAdmin/components/TableLayout';
import TableHeader from '@ProcarefulAdmin/components/TableLayout/TableHeader';
import { PaginationSize, PathRoutes, selectStatusOptions } from '@ProcarefulAdmin/constants';
import useTableFilter from '@ProcarefulAdmin/hooks/useTableFilter';
import type {
  TableHeaderButtonProps,
  SearchProps,
  PaginationTableProps,
} from '@ProcarefulAdmin/typings';
import { selectRoleOptions } from '@ProcarefulAdmin/utils';
import {
  type AdminInstitutionControllerGetFormalCaregiversFilterStatusStatusName,
  type AdminInstitutionControllerGetFormalCaregiversFilterCaregiverRolesRoleName,
  useAdminInstitutionControllerGetFormalCaregivers,
  type AdminInstitutionControllerGetFormalCaregiversParams,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import { useStyles } from '../styles';
import { columnData } from './helpers';

type TableFilters = AdminInstitutionControllerGetFormalCaregiversParams & {
  status?: AdminInstitutionControllerGetFormalCaregiversFilterStatusStatusName;
  role?: AdminInstitutionControllerGetFormalCaregiversFilterCaregiverRolesRoleName;
};

const FormalCaregiversTable = () => {
  const { t } = useTypedTranslation();
  const { styles } = useStyles();
  const navigate = useNavigate();

  const {
    filters: { search, status, role, page },
    handleFilterChange,
  } = useTableFilter<TableFilters>({
    search: undefined,
    status: undefined,
    role: undefined,
    page: 1,
  });

  const { data, isLoading } = useAdminInstitutionControllerGetFormalCaregivers(
    {
      search,
      'filter[status][status_name]': status,
      'filter[caregiver_roles][role_name]': role,
      page,
      pageSize: PaginationSize.Small,
    },
    {
      query: {
        placeholderData: keepPreviousData,
      },
    }
  );

  const searchMenu: SearchProps = {
    onSearch: handleFilterChange('search'),
    placeholder: t('admin_form_search_user'),
    className: styles.search,
    allowClear: true,
  };

  const selectMenus: SelectProps[] = [
    {
      id: '3',
      options: selectRoleOptions,
      placeholder: t('admin_table_role'),
      onChange: handleFilterChange('role'),
      allowClear: true,
    },
    {
      id: '4',
      options: selectStatusOptions,
      placeholder: t('admin_table_status'),
      onChange: handleFilterChange('status'),
      allowClear: true,
    },
  ];

  const buttonMenu: TableHeaderButtonProps = {
    title: t('admin_btn_add_caregiver'),
    icon: <PersonAddAlt1OutlinedIcon />,
    onClick: () => navigate(PathRoutes.FormalCaregiverAdd),
  };

  const paginationConfig: PaginationTableProps = {
    current: page,
    total: data?.details.pagination.total,
    pageSize: PaginationSize.Small,
    onChange: handleFilterChange('page'),
  };

  return (
    <TableLayout
      loading={isLoading}
      dataSource={data?.details.items}
      columns={columnData}
      pagination={paginationConfig}
      rowKey={item => item.id}
      tableHeader={
        <TableHeader
          title={t('admin_title_formal_caregivers')}
          searchMenu={searchMenu}
          selectMenus={selectMenus}
          buttonMenu={buttonMenu}
        />
      }
    />
  );
};

export default FormalCaregiversTable;
