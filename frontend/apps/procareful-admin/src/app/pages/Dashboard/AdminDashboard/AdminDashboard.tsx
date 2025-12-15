import { keepPreviousData } from '@tanstack/react-query';
import useTableFilter from '@ProcarefulAdmin/hooks/useTableFilter';
import {
  type AdminInstitutionControllerGetDashboardAdminViewParams,
  useAdminInstitutionControllerGetDashboardAdminView,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import AmountTile from './AmountTile';
import CaregiversWorkloadList from './CaregiversWorkloadList';
import RolesDistributionBarChart from './RolesDistributionBarChart';
import { caregiversWorkloadListInfo, rolesDistributionBarChartInfo } from './constants';
import { useStyles } from './styles';

const AdminDashboard = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  const {
    filters: { sortOrder },
    handleFilterChange,
  } = useTableFilter<AdminInstitutionControllerGetDashboardAdminViewParams>({
    sortOrder: undefined,
  });

  const { data: dashboardData, isFetching } = useAdminInstitutionControllerGetDashboardAdminView(
    {
      sortOrder,
    },
    {
      query: {
        placeholderData: keepPreviousData,
      },
    }
  );

  const {
    caregiversWorkload,
    rolesDistribution,
    seniors = 0,
    informalCaregivers = 0,
    formalCaregivers = 0,
  } = dashboardData?.details || {};

  return (
    <div className={styles.container}>
      <section className={styles.seniorsAmount}>
        <AmountTile title={t('admin_title_seniors')} amount={seniors} iconType="single" />
      </section>
      <section className={styles.informalAmount}>
        <AmountTile
          title={t('admin_title_informal_caregivers')}
          amount={informalCaregivers}
          iconType="double"
        />
      </section>
      <section className={styles.formalAmount}>
        <AmountTile
          title={t('admin_title_formal_caregivers')}
          amount={formalCaregivers}
          iconType="multi"
        />
      </section>
      <section className={styles.rolesDistribution}>
        <RolesDistributionBarChart
          {...rolesDistributionBarChartInfo}
          rolesDistribution={rolesDistribution || {}}
        />
      </section>
      <section className={styles.caregiversWorkload}>
        <CaregiversWorkloadList
          {...caregiversWorkloadListInfo}
          caregiversWorkload={caregiversWorkload || []}
          handleFilterChange={handleFilterChange('sortOrder')}
          isLoading={isFetching}
        />
      </section>
    </div>
  );
};

export default AdminDashboard;
