import { Bar } from '@ant-design/plots';
import ChartLayout from '@ProcarefulAdmin/components/ChartLayout';
import type { ChartProps } from '@ProcarefulAdmin/typings';
import { type GetDashboardInstitutionViewDtoRolesDistribution } from '@Procareful/common/api';
import { i18n } from '@Procareful/common/i18n';
import NoDataPlaceholder from '../../NoDataPlaceholder';
import { config, placeholderConfig } from './constants';
import { useStyles } from './styles';

type RolesDistributionProps = ChartProps & {
  rolesDistribution: GetDashboardInstitutionViewDtoRolesDistribution;
};

const RolesDistributionBarChart = ({
  chartTitle,
  chartSubtitle,
  chartDescription,
  rolesDistribution,
}: RolesDistributionProps) => {
  const { styles } = useStyles();

  const transformedArrayOfRoles = Object.entries(rolesDistribution).map(([key, value]) => ({
    get name() {
      return i18n.t(`admin_title_caregiver_role_${key}`);
    },
    value: value,
  }));

  const isDataAvailable = Object.values(rolesDistribution).some(value => value !== 0);

  const updatedConfig = { ...config, data: transformedArrayOfRoles };

  return (
    <ChartLayout
      description={chartDescription}
      title={chartTitle}
      subtitle={chartSubtitle}
      shadowContainer
      chartType="bar"
      fitContent
    >
      {isDataAvailable ? (
        <Bar className={styles.graph} {...updatedConfig} />
      ) : (
        <NoDataPlaceholder {...placeholderConfig} className={styles.placeholder} />
      )}
    </ChartLayout>
  );
};

export default RolesDistributionBarChart;
