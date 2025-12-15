import CenteredSpinner from '@ProcarefulAdmin/components/CenteredSpinner';
import NoDataPlaceholder from '@ProcarefulAdmin/pages/Dashboard/NoDataPlaceholder';
import CognitiveGames from '@ProcarefulAdmin/pages/SeniorProfile/tabs/PerformanceTab/OverallEngagement/CognitiveGames';
import PersonalGrowth from '@ProcarefulAdmin/pages/SeniorProfile/tabs/PerformanceTab/OverallEngagement/PersonalGrowth';
import PhysicalActivity from '@ProcarefulAdmin/pages/SeniorProfile/tabs/PerformanceTab/OverallEngagement/PhysicalActivity';
import { type GetUserPerformanceResponse } from '@Procareful/common/api';
import { placeholderConfig } from './constants';
import { useStyles } from './styles';

type OverallEngagementProps = {
  personalData: GetUserPerformanceResponse;
  isPersonalDataLoading: boolean;
};

const OverallEngagement = ({ personalData, isPersonalDataLoading }: OverallEngagementProps) => {
  const { styles } = useStyles();

  const isDataAvailable =
    personalData?.details && Object.values(personalData?.details).some(value => value > 0);

  const renderCharts = () => {
    if (isDataAvailable) {
      return (
        <div className={styles.progressContainer}>
          <CognitiveGames personalData={personalData} />
          <PhysicalActivity physicalActivityData={personalData} />
          <PersonalGrowth personalData={personalData} />
        </div>
      );
    }

    return <NoDataPlaceholder {...placeholderConfig} />;
  };

  return !isPersonalDataLoading ? renderCharts() : <CenteredSpinner />;
};

export default OverallEngagement;
