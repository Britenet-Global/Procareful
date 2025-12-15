import {
  useUserControllerGetActivePersonalGrowthChallenge,
  useUserControllerGetBrainPoints,
  useUserControllerGetDashboard,
  useUserControllerGetDayStreakTrophy,
} from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { HttpStatusCode } from 'axios';
import { Trans } from 'react-i18next';
import { Spin } from 'antd';
import GameSection from './GameSection';
import MainTile from './MainTile';
import PersonalGrowthSection from './PersonalGrowthSection';
import PhysicalSection from './PhysicalSection';
import TopBar from './TopBar';
import { verifyDashboardData } from './helpers';
import { useStyles } from './styles';

const Dashboard = () => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const { data: trophyData } = useUserControllerGetDayStreakTrophy();

  const {
    data: dashboardData,
    isLoading: isDashboardDataLoading,
    error,
  } = useUserControllerGetDashboard();
  const { data: userPointsData } = useUserControllerGetBrainPoints();

  const {
    dailyProgress = 0,
    completedTasks = 0,
    totalTasks = 0,
    schedule,
    firstName = '',
  } = dashboardData?.details || {};
  const hasAssessmentCompleted = error?.response?.status !== HttpStatusCode.NotFound;

  const {
    hasPhysicalExercises,
    hasPhysicalExercisesMorning,
    hasPhysicalExercisesMidDay,
    hasBreathingExercises,
    hasBreathingExercisesMorning,
    hasBreathingExercisesMidDay,
    hasWalkingExercises,
    hasPersonalGrowth,
  } = verifyDashboardData(schedule);

  const { data: personalGrowthActiveData } = useUserControllerGetActivePersonalGrowthChallenge({
    query: {
      enabled: !hasPersonalGrowth,
    },
  });

  const {
    title: personalGrowthTitleFromBackend,
    description: personalGrowthDescriptionFromBackend,
  } =
    personalGrowthActiveData?.details?.user_personal_growth_challenges ||
    schedule?.personalGrowth ||
    {};

  const handleRenderDashboardActivities = () => {
    if (isDashboardDataLoading) {
      return <Spin size="large" />;
    }

    const personalGrowthTitle = personalGrowthTitleFromBackend || t('senior_title_congrats');

    const personalGrowthSubtitle = personalGrowthDescriptionFromBackend || (
      <Trans>{t('senior_inf_new_challenges_waiting')}</Trans>
    );

    const hasActivityPlanned =
      (!hasPhysicalExercises && !hasBreathingExercises && !hasWalkingExercises) ||
      (!hasPhysicalExercisesMorning &&
        !hasPhysicalExercisesMidDay &&
        !hasBreathingExercisesMorning &&
        !hasBreathingExercisesMidDay);

    return (
      <>
        <MainTile
          name={firstName}
          totalActivities={totalTasks}
          completedActivities={completedTasks}
          dailyProgress={dailyProgress}
        />
        <GameSection
          isCompleted={!!schedule?.games.completed}
          hasAssessmentCompleted={hasAssessmentCompleted}
        />
        <PhysicalSection
          hasActivityPlannedToday={hasActivityPlanned}
          hasAssessmentCompleted={hasAssessmentCompleted}
          scheduleData={schedule}
          isLoading={isDashboardDataLoading}
        />
        <PersonalGrowthSection
          title={personalGrowthTitle}
          subtitle={personalGrowthSubtitle}
          isCompleted={
            !hasPersonalGrowth || !!schedule?.personalGrowth?.allPersonalGrowthChallengesCompleted
          }
          hasAssessmentCompleted={hasAssessmentCompleted && !!hasPersonalGrowth}
        />
      </>
    );
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.centeredContainer}>
        {!isDashboardDataLoading && (
          <TopBar points={Number(userPointsData?.details) || 0} trophies={trophyData?.details} />
        )}
        <div
          className={cx(styles.container, { [styles.loadingContainer]: isDashboardDataLoading })}
        >
          {handleRenderDashboardActivities()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
