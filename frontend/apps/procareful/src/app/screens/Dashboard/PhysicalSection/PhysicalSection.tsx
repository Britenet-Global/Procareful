import type { GetScheduleDto } from '@Procareful/common/api';
import { useTypedTranslation, ProcarefulAppPathRoutes, SearchParams } from '@Procareful/common/lib';
import { Text } from '@Procareful/ui';
import { Spin } from 'antd';
import ActivityTile from '../ActivityTile';
import NoDataPlaceholderTile from '../NoDataPlaceholderTile';
import { verifyDashboardData } from '../helpers';
import { type ProgressActivityExercises, progressActivityFormatter } from './helpers';
import { useStyles } from './styles';

export type Activity = {
  total: number;
  completed: number;
};

type PhysicalSectionProps = {
  hasAssessmentCompleted: boolean;
  hasActivityPlannedToday: boolean;
  scheduleData?: GetScheduleDto;
  isLoading: boolean;
};

const PhysicalSection = ({
  hasAssessmentCompleted,
  hasActivityPlannedToday,
  scheduleData,
  isLoading,
}: PhysicalSectionProps) => {
  const { styles } = useStyles();
  const { t } = useTypedTranslation();
  const {
    hasPhysicalExercises,
    hasPhysicalExercisesMorning,
    hasPhysicalExercisesMidDay,
    hasBreathingExercises,
    hasBreathingExercisesMorning,
    hasBreathingExercisesMidDay,
    hasWalkingExercises,
  } = verifyDashboardData(scheduleData);
  const isWalkingExercisesCompleted = scheduleData?.walkingExercises?.completed;

  const walkingExerciseRedirectConfig = {
    pathname: ProcarefulAppPathRoutes.PhysicalActivitiesWalking,
    search: new URLSearchParams({
      [SearchParams.IsCompleted]: isWalkingExercisesCompleted?.toString() || '',
    }).toString(),
  };

  const placeholderTileConfig = {
    title: t('admin_title_nothing_here'),
    description: hasAssessmentCompleted
      ? t('senior_title_no_workout_available')
      : t('senior_title_no_workout_assigned'),
  };

  if (isLoading) {
    return <Spin />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Text strong>{t('shared_title_physical_activity')}</Text>
      </div>
      {hasActivityPlannedToday && hasAssessmentCompleted ? (
        <>
          {hasPhysicalExercisesMorning && (
            <ActivityTile
              redirectTo={ProcarefulAppPathRoutes.PhysicalActivitiesStartYourDay}
              type="strength"
              title={t('senior_title_start_your_day')}
              description={t('senior_title_start_your_day_description')}
              progressActivity={progressActivityFormatter(
                scheduleData?.physicalExercisesMorning as unknown as ProgressActivityExercises[]
              )}
            />
          )}
          {hasPhysicalExercisesMidDay && (
            <ActivityTile
              redirectTo={ProcarefulAppPathRoutes.PhysicalActivitiesStayActive}
              type="strength"
              title={t('senior_title_stay_active')}
              description={t('senior_title_stay_active_description')}
              progressActivity={progressActivityFormatter(
                scheduleData?.physicalExercisesMidDay as unknown as ProgressActivityExercises[]
              )}
            />
          )}
          {hasPhysicalExercises && (
            <ActivityTile
              redirectTo={ProcarefulAppPathRoutes.PhysicalActivitiesExercises}
              type="strength"
              title={t('senior_title_stay_active')}
              description={t('senior_title_daily_dose_of_activity')}
              progressActivity={progressActivityFormatter(
                scheduleData?.physicalExercises as unknown as ProgressActivityExercises[]
              )}
            />
          )}
          {hasBreathingExercisesMorning && (
            <ActivityTile
              redirectTo={ProcarefulAppPathRoutes.PhysicalActivitiesDawnDeepBreaths}
              type="breath"
              title={t('senior_title_dawn_deep_breaths')}
              description={t('senior_title_time_to_relax')}
              progressActivity={progressActivityFormatter(
                scheduleData?.breathingExercisesMorning as unknown as ProgressActivityExercises[]
              )}
            />
          )}
          {hasBreathingExercisesMidDay && (
            <ActivityTile
              redirectTo={ProcarefulAppPathRoutes.PhysicalActivitiesTwilightBreaths}
              type="breath"
              title={t('senior_title_twilight_breaths')}
              description={t('senior_title_time_to_relax')}
              progressActivity={progressActivityFormatter(
                scheduleData?.breathingExercisesMidDay as unknown as ProgressActivityExercises[]
              )}
            />
          )}
          {hasBreathingExercises && (
            <ActivityTile
              redirectTo={ProcarefulAppPathRoutes.PhysicalActivitiesBreathing}
              type="breath"
              title={t('senior_title_breathing')}
              description={t('senior_title_time_to_relax')}
              progressActivity={progressActivityFormatter(
                scheduleData?.breathingExercises as unknown as ProgressActivityExercises[]
              )}
            />
          )}
          {hasWalkingExercises && (
            <ActivityTile
              redirectTo={walkingExerciseRedirectConfig}
              type="walking"
              title={t('shared_title_walking')}
              description={t('senior_title_time_for_walk')}
              isCompleted={isWalkingExercisesCompleted}
            />
          )}
        </>
      ) : (
        <NoDataPlaceholderTile type="strength" {...placeholderTileConfig} />
      )}
    </div>
  );
};

export default PhysicalSection;
