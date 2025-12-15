import { keepPreviousData } from '@tanstack/react-query';
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
  type AdminControllerGetAllInstitutionsFilterStatusStatusName,
  type AdminControllerGetSuperInstitutionAdminsParams,
  useAdminControllerGetAllInstitutions,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import { getColumnData } from './helpers';
import { useStyles } from './styles';

type TableFilters = AdminControllerGetSuperInstitutionAdminsParams & {
  status?: AdminControllerGetAllInstitutionsFilterStatusStatusName;
};

const Institutions = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  const {
    filters: { search, status, page },
    handleFilterChange,
  } = useTableFilter<TableFilters>({ search: undefined, status: undefined, page: 1 });

  const { data, isLoading, isFetching } = useAdminControllerGetAllInstitutions(
    {
      search,
      'filter[status][status_name]': status,
      page,
      pageSize: PaginationSize.Large,
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
    allowClear: true,
  };

  const selectMenus: SelectProps[] = [
    {
      id: '1',
      options: selectStatusOptions,
      placeholder: t('admin_btn_status'),
      onChange: handleFilterChange('status'),
      allowClear: true,
    },
  ];

  const buttonMenu: TableHeaderButtonProps = {
    title: t('admin_btn_add'),
    icon: <PersonAddAlt1OutlinedIcon />,
    buttonType: 'link',
    navigateTo: PathRoutes.InstitutionsAdd,
  };

  const paginationConfig: PaginationTableProps = {
    current: page,
    total: data?.details.pagination.total,
    pageSize: PaginationSize.Large,
    onChange: handleFilterChange('page'),
  };

  const columnData = getColumnData({
    page,
    pageSize: PaginationSize.Large,
  });

  return (
    <TableLayout
      loading={isLoading || isFetching}
      dataSource={data?.details.items}
      columns={columnData}
      pagination={paginationConfig}
      className={styles.tableContainer}
      rowKey={item => item.id}
      tableHeader={
        <TableHeader
          title={t('admin_title_institutions')}
          searchMenu={searchMenu}
          selectMenus={selectMenus}
          buttonMenu={buttonMenu}
        />
      }
    />
  );
};

export default Institutions;
