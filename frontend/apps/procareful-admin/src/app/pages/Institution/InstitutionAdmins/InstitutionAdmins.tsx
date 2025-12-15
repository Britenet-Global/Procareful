import { keepPreviousData } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import TableLayout from '@ProcarefulAdmin/components/TableLayout';
import TableHeader from '@ProcarefulAdmin/components/TableLayout/TableHeader';
import { PaginationSize, PathRoutes } from '@ProcarefulAdmin/constants';
import { useOnboardingStepComplete } from '@ProcarefulAdmin/hooks/useOnboardingStepComplete';
import useTableFilter from '@ProcarefulAdmin/hooks/useTableFilter';
import type {
  PaginationTableProps,
  SearchProps,
  TableHeaderButtonProps,
} from '@ProcarefulAdmin/typings';
import {
  type AdminInstitutionControllerGetAllAdminsInstitutionParams,
  type GetInstitutionAdminsDto,
  useAdminInstitutionControllerGetAllAdminsInstitution,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import { useInstitutionAdminsData } from './helpers';
import { useStyles } from './styles';

const InstitutionAdmins = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const { columnData, hasUserEditPermission } = useInstitutionAdminsData();
  const navigate = useNavigate();
  useOnboardingStepComplete();

  const {
    filters: { search, page },
    handleFilterChange,
  } = useTableFilter<AdminInstitutionControllerGetAllAdminsInstitutionParams>({
    search: undefined,
    page: 1,
  });

  const { data, isLoading } = useAdminInstitutionControllerGetAllAdminsInstitution(
    {
      search,
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
    className: styles.search,
    allowClear: true,
  };

  const buttonMenu: TableHeaderButtonProps = {
    title: t('admin_btn_add_admin'),
    icon: <PersonAddAlt1OutlinedIcon />,
    onClick: () => navigate(PathRoutes.AddInstitutionAdmin),
  };

  const paginationConfig: PaginationTableProps = {
    current: page,
    total: data?.details.pagination.total,
    pageSize: PaginationSize.Large,
    onChange: handleFilterChange('page'),
  };

  return (
    <TableLayout
      dataSource={data?.details.items as GetInstitutionAdminsDto[]}
      columns={columnData}
      pagination={paginationConfig}
      loading={isLoading}
      rowKey={item => item.id}
      tableHeader={
        <TableHeader
          title={t('admin_title_institution_admins')}
          searchMenu={searchMenu}
          buttonMenu={hasUserEditPermission ? buttonMenu : undefined}
        />
      }
    />
  );
};

export default InstitutionAdmins;
