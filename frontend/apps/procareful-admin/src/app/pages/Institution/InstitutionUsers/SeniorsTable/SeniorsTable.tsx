import { keepPreviousData } from '@tanstack/react-query';
import type { SelectProps } from 'antd';
import TableLayout from '@ProcarefulAdmin/components/TableLayout';
import TableHeader from '@ProcarefulAdmin/components/TableLayout/TableHeader';
import { PaginationSize, selectStatusOptions } from '@ProcarefulAdmin/constants';
import useTableFilter from '@ProcarefulAdmin/hooks/useTableFilter';
import type { PaginationTableProps, SearchProps } from '@ProcarefulAdmin/typings';
import {
  type AdminInstitutionControllerGetUsersFilterStatusStatusName,
  useAdminInstitutionControllerGetUsers,
  type AdminInstitutionControllerGetUsersParams,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import { useStyles } from '../styles';
import { columnData } from './helpers';

type TableFilters = AdminInstitutionControllerGetUsersParams & {
  status?: AdminInstitutionControllerGetUsersFilterStatusStatusName;
};

const SeniorsTable = () => {
  const { t } = useTypedTranslation();
  const { styles } = useStyles();

  const {
    filters: { search, status, page },
    handleFilterChange,
  } = useTableFilter<TableFilters>({
    search: undefined,
    status: undefined,
    page: 1,
  });

  const { data, isLoading } = useAdminInstitutionControllerGetUsers(
    {
      search,
      'filter[status][status_name]':
        status as AdminInstitutionControllerGetUsersFilterStatusStatusName,
      page,
      pageSize: PaginationSize.Small,
    },
    {
      query: {
        placeholderData: keepPreviousData,
      },
    }
  );

  const rowData = data?.details.items;

  const searchMenu: SearchProps = {
    onSearch: handleFilterChange('search'),
    placeholder: t('admin_form_search_user'),
    className: styles.search,
    allowClear: true,
  };

  const selectMenus: SelectProps[] = [
    {
      id: '2',
      options: selectStatusOptions,
      placeholder: t('admin_table_status'),
      onChange: handleFilterChange('status'),
      allowClear: true,
    },
  ];

  const paginationConfig: PaginationTableProps = {
    current: page,
    total: data?.details.pagination.total,
    pageSize: PaginationSize.Small,
    onChange: handleFilterChange('page'),
  };

  return (
    <TableLayout
      loading={isLoading}
      dataSource={rowData}
      columns={columnData}
      pagination={paginationConfig}
      rowKey={item => item.id}
      tableHeader={
        <TableHeader
          title={t('admin_title_seniors')}
          searchMenu={searchMenu}
          selectMenus={selectMenus}
        />
      }
    />
  );
};

export default SeniorsTable;
