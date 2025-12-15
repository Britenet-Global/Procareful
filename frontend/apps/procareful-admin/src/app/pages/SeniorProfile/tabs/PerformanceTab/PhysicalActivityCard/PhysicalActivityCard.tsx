import { Progress } from 'antd';
import CenteredSpinner from '@ProcarefulAdmin/components/CenteredSpinner';
import ChartLayout from '@ProcarefulAdmin/components/ChartLayout';
import NoDataPlaceholder from '@ProcarefulAdmin/pages/Dashboard/NoDataPlaceholder';
import type { GetUserPhysicalPerformanceResponse } from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { Text, globalStyles } from '@Procareful/ui';
import { placeholderConfig } from './constants';
import { useStyles } from './styles';

type PhysicalActivityCardProps = {
  physicalActivityData?: GetUserPhysicalPerformanceResponse;
  isLoading: boolean;
};

const PhysicalActivity = ({ physicalActivityData, isLoading }: PhysicalActivityCardProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();

  const {
    breathingExercisesPercentage = 0,
    physicalExercisesPercentage = 0,
    walkingExercisesPercentage = 0,
    totalExercisesToDo = 0,
  } = physicalActivityData?.details || {};

  const isDataAvailable =
    breathingExercisesPercentage > 0 ||
    physicalExercisesPercentage > 0 ||
    walkingExercisesPercentage > 0 ||
    totalExercisesToDo > 0;

  const progressData = [
    { label: t('shared_title_breathing_exercises'), percent: breathingExercisesPercentage },
    { label: t('admin_title_physical_exercises'), percent: physicalExercisesPercentage },
    { label: t('admin_title_walking_exercise'), percent: walkingExercisesPercentage },
  ];

  const renderChart = () => {
    if (isDataAvailable) {
      return (
        <div className={styles.lineProgressContainer}>
          {progressData.map(({ label, percent }, index) => {
            if (percent === null) {
              return null;
            }

            return (
              <div key={index} className={styles.lineProgressItem}>
                <Text className={styles.text}>{label}</Text>
                <Progress
                  percent={percent}
                  strokeColor={globalStyles.themeColors.colorInfoBorder}
                />
              </div>
            );
          })}
        </div>
      );
    }

    return <NoDataPlaceholder {...placeholderConfig} />;
  };

  return (
    <ChartLayout
      title={t('shared_title_physical_activity')}
      subtitle={t('admin_table_last_30_days')}
      shadowContainer={false}
      className={styles.card}
      chartType="line"
      description={t('admin_table_description_physical_activities_completed')}
      containerBordered
      descriptionClassName={styles.description}
    >
      {!isLoading ? renderChart() : <CenteredSpinner />}
    </ChartLayout>
  );
};

export default PhysicalActivity;
