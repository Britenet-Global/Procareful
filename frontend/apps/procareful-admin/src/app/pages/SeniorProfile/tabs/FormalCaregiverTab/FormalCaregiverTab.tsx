import { useSearchParams } from 'react-router-dom';
import TableLayout from '@ProcarefulAdmin/components/TableLayout';
import TableHeader from '@ProcarefulAdmin/components/TableLayout/TableHeader';
import { PaginationSize } from '@ProcarefulAdmin/constants';
import useTableFilter from '@ProcarefulAdmin/hooks/useTableFilter';
import type { PaginationTableProps } from '@ProcarefulAdmin/typings';
import { verifyAccessByRole } from '@ProcarefulAdmin/utils';
import {
  type CaregiverControllerGetUserParams,
  AdminRolesDtoRoleName,
  type AdminRolesDto,
  useCaregiverControllerGetUser,
} from '@Procareful/common/api';
import { useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import { columnsData } from './helpers';
import { useStyles } from './styles';

const FormalCaregiverTab = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const [searchParams] = useSearchParams();

  const seniorId = Number(searchParams.get(SearchParams.Id));

  const {
    filters: { page },
    handleFilterChange,
  } = useTableFilter<CaregiverControllerGetUserParams>({ page: 1 });

  const { data: seniorData, isLoading: isSeniorDataLoading } = useCaregiverControllerGetUser(
    Number(seniorId),
    {
      page: 1,
      pageSize: PaginationSize.Large,
    }
  );

  const paginationConfig: PaginationTableProps = {
    current: page,
    total: seniorData?.details.caregivers.pagination?.totalItems,
    pageSize: PaginationSize.Large,
    onChange: handleFilterChange('page'),
    paginationPosition: 'bottom',
  };

  const formalCaregivers = seniorData?.details.caregivers?.items?.filter(item =>
    verifyAccessByRole(
      AdminRolesDtoRoleName.formalCaregiver,
      item.roles as unknown as AdminRolesDto[]
    )
  );

  return (
    <div className={styles.container}>
      <TableLayout
        dataSource={formalCaregivers}
        containerClassName={styles.container}
        className={styles.container}
        columns={columnsData}
        pagination={paginationConfig}
        rowKey={record => record.id}
        loading={isSeniorDataLoading}
        tableHeader={<TableHeader title={t('admin_title_formal_caregivers')} />}
      />
    </div>
  );
};

export default FormalCaregiverTab;
