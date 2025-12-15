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
import {
  type AdminInstitutionControllerGetInformalCaregiversFilterStatusStatusName,
  useAdminInstitutionControllerGetInformalCaregivers,
  type AdminInstitutionControllerGetInformalCaregiversParams,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import { useStyles } from '../styles';
import { columnData } from './helpers';

type TableFilters = AdminInstitutionControllerGetInformalCaregiversParams & {
  status?: AdminInstitutionControllerGetInformalCaregiversFilterStatusStatusName;
};

const InformalCaregiversTable = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();

  const {
    filters: { search, status, page },
    handleFilterChange,
  } = useTableFilter<TableFilters>({ search: undefined, status: undefined, page: 1 });

  const { data, isLoading } = useAdminInstitutionControllerGetInformalCaregivers(
    {
      search,
      'filter[status][status_name]':
        status as AdminInstitutionControllerGetInformalCaregiversFilterStatusStatusName,
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
    placeholder: t('admin_form_search'),
    className: styles.search,
    allowClear: true,
  };

  const selectMenus: SelectProps[] = [
    {
      id: '1',
      options: selectStatusOptions,
      placeholder: t('admin_table_status'),
      onChange: handleFilterChange('status'),
      allowClear: true,
    },
  ];

  const buttonMenu: TableHeaderButtonProps = {
    title: t('admin_btn_add_caregiver'),
    icon: <PersonAddAlt1OutlinedIcon />,
    onClick: () => navigate(PathRoutes.InformalCaregiverAdd),
  };

  const paginationConfig: PaginationTableProps = {
    current: page,
    total: data?.details.pagination.total,
    pageSize: PaginationSize.Small,
    onChange: handleFilterChange('page'),
  };

  return (
    <TableLayout
      dataSource={data?.details.items}
      columns={columnData}
      pagination={paginationConfig}
      rowKey={item => item.id}
      loading={isLoading}
      tableHeader={
        <TableHeader
          title={t('admin_title_informal_caregivers')}
          searchMenu={searchMenu}
          selectMenus={selectMenus}
          buttonMenu={buttonMenu}
        />
      }
    />
  );
};

export default InformalCaregiversTable;
