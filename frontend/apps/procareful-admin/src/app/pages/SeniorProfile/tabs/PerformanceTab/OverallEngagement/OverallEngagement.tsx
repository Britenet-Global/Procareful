import { useSearchParams } from 'react-router-dom';
import CenteredSpinner from '@ProcarefulAdmin/components/CenteredSpinner';
import ChartLayout from '@ProcarefulAdmin/components/ChartLayout';
import NoDataPlaceholder from '@ProcarefulAdmin/pages/Dashboard/NoDataPlaceholder';
import { useCaregiverControllerGetUserPerformance } from '@Procareful/common/api';
import { SearchParams, useTypedTranslation } from '@Procareful/common/lib';
import CognitiveGames from './CognitiveGames';
import PersonalGrowth from './PersonalGrowth';
import PhysicalActivity from './PhysicalActivity';
import { placeholderConfig } from './constants';
import { useStyles } from './styles';

const OverallEngagement = () => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const [searchParams] = useSearchParams();
  const userId = Number(searchParams.get(SearchParams.Id));

  const { data, isLoading } = useCaregiverControllerGetUserPerformance({ userId });

  const isDataAvailable = data?.details && Object.values(data?.details).some(value => value > 0);

  const renderCharts = () => {
    if (isDataAvailable) {
      return (
        <div className={styles.progressContainer}>
          <CognitiveGames personalData={data} />
          <PhysicalActivity physicalActivityData={data} />
          <PersonalGrowth personalData={data} />
        </div>
      );
    }

    return <NoDataPlaceholder {...placeholderConfig} />;
  };

  return (
    <ChartLayout
      title={t('admin_title_overall_engagement')}
      subtitle={t('admin_title_overall_engagement_track_senior_activity')}
      shadowContainer={false}
      className={styles.card}
      chartType="circular"
      description={t('admin_inf_description_overall_engagement')}
      containerBordered
    >
      {!isLoading ? renderCharts() : <CenteredSpinner />}
    </ChartLayout>
  );
};

export default OverallEngagement;
