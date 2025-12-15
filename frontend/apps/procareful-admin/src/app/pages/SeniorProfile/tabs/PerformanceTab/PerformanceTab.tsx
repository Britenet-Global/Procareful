import { useSearchParams } from 'react-router-dom';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { useCaregiverControllerGetPhysicalActivitiesPerformance } from '@Procareful/common/api';
import { SearchParams } from '@Procareful/common/lib';
import { useTypedTranslation } from '@Procareful/common/lib/hooks';
import CognitiveGamesEngagement from './CognitiveGamesEngagement';
import OverallEngagement from './OverallEngagement';
import PhysicalActivityCard from './PhysicalActivityCard';
import { useStyles } from './styles';

const PerformanceTab = () => {
  const { t } = useTypedTranslation();
  const { styles } = useStyles();
  const [searchParams] = useSearchParams();
  const userId = Number(searchParams.get(SearchParams.Id));

  const { data: physicalActivityData, isLoading: isPhysicalActivityDataLoading } =
    useCaregiverControllerGetPhysicalActivitiesPerformance(userId);

  return (
    <StyledCard title={t('admin_table_performance')} className={styles.wrapperContainer}>
      <div className={styles.container}>
        <section className={styles.overallEngagementContainer}>
          <OverallEngagement />
        </section>
        <section className={styles.physicalActivityContainer}>
          <PhysicalActivityCard
            physicalActivityData={physicalActivityData}
            isLoading={isPhysicalActivityDataLoading}
          />
        </section>
        <section className={styles.cognitiveGamesContainer}>
          <CognitiveGamesEngagement />
        </section>
      </div>
    </StyledCard>
  );
};

export default PerformanceTab;
