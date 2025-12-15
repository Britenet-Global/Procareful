import { useUserControllerGetUserActivitiesList } from '@Procareful/common/api';
import { useTypedTranslation } from '@Procareful/common/lib';
import { ProcarefulAppPathRoutes, SearchParams } from '@Procareful/common/lib/constants';
import { Text } from '@Procareful/ui';
import { RedirectTile } from '@ProcarefulApp/components/RedirectTile';
import TopBarLayout from '@ProcarefulApp/layout/TopBarLayout';
import { type To, useLocation } from 'react-router-dom';
import { activityDayTimeByRoute, exerciseTypeByRoute, physicalExercisesName } from './constants';
import { useStyles } from './styles';

const PhysicalActivities = () => {
  const { pathname } = useLocation();
  const { t } = useTypedTranslation();
  const { styles } = useStyles();
  const { data, isLoading } = useUserControllerGetUserActivitiesList({
    exercise_type: exerciseTypeByRoute[pathname as keyof typeof exerciseTypeByRoute],
  });

  const {
    exercise_in_bed,
    exercise_sitting,
    fall_prevention,
    sitting_balance_and_coordination,
    sitting_lower_body,
    sitting_upper_body,
  } = data?.details || {};

  const activityDayTime = activityDayTimeByRoute[pathname as keyof typeof activityDayTimeByRoute];

  const getRedirectToConfig = (title: string, isCompleted: boolean) => {
    if (isCompleted === undefined || !title) return;

    const additionalParams = activityDayTime
      ? { [SearchParams.ExerciseType]: activityDayTime }
      : null;

    return {
      pathname: ProcarefulAppPathRoutes.PhysicalActivityDetails,
      search: new URLSearchParams({
        [SearchParams.Name]: title,
        [SearchParams.IsCompleted]: isCompleted.toString(),
        ...additionalParams,
      }).toString(),
    } as To;
  };

  return (
    <TopBarLayout backTo={ProcarefulAppPathRoutes.Dashboard} isLoading={isLoading}>
      {exercise_in_bed && (
        <div>
          <Text strong className={styles.textContainer}>
            {t('senior_title_exercises_in_bed_choose')}
          </Text>
          {exercise_in_bed.map(({ name, completed }) => (
            <RedirectTile
              key={name}
              title={physicalExercisesName[name as unknown as keyof typeof physicalExercisesName]}
              subtitle={completed ? t('senior_title_completed') : undefined}
              isCompleted={completed}
              redirectTo={getRedirectToConfig(name, completed)}
            />
          ))}
        </div>
      )}
      {exercise_sitting && (
        <div>
          <Text strong className={styles.textContainer}>
            {t('senior_title_sitting_exercises')}
          </Text>
          {exercise_sitting.map(({ name, completed }) => (
            <RedirectTile
              key={name}
              title={physicalExercisesName[name as unknown as keyof typeof physicalExercisesName]}
              subtitle={completed ? t('senior_title_completed') : undefined}
              isCompleted={completed}
              redirectTo={getRedirectToConfig(name, completed)}
            />
          ))}
        </div>
      )}
      {fall_prevention && (
        <div>
          <Text strong className={styles.textContainer}>
            {t('senior_title_fall_prevention_or_balance')}
          </Text>
          {fall_prevention.map(({ name, completed }) => (
            <RedirectTile
              key={name}
              title={physicalExercisesName[name as unknown as keyof typeof physicalExercisesName]}
              subtitle={completed ? t('senior_title_completed') : undefined}
              isCompleted={completed}
              redirectTo={getRedirectToConfig(name, completed)}
            />
          ))}
        </div>
      )}
      {sitting_balance_and_coordination && (
        <div>
          <Text strong className={styles.textContainer}>
            {t('senior_title_coordination_and_balance')}
          </Text>
          {sitting_balance_and_coordination.map(({ name, completed }) => (
            <RedirectTile
              key={name}
              title={physicalExercisesName[name as unknown as keyof typeof physicalExercisesName]}
              subtitle={completed ? t('senior_title_completed') : undefined}
              isCompleted={completed}
              redirectTo={getRedirectToConfig(name, completed)}
            />
          ))}
        </div>
      )}
      {sitting_lower_body && (
        <div className={styles.marginTop}>
          <Text strong className={styles.textContainer}>
            {t('senior_title_lower_body')}
          </Text>
          {sitting_lower_body.map(({ name, completed }) => (
            <RedirectTile
              key={name}
              title={physicalExercisesName[name as unknown as keyof typeof physicalExercisesName]}
              subtitle={completed ? t('senior_title_completed') : undefined}
              isCompleted={completed}
              redirectTo={getRedirectToConfig(name, completed)}
            />
          ))}
        </div>
      )}
      {sitting_upper_body && (
        <div className={styles.marginTop}>
          <Text strong className={styles.textContainer}>
            {t('senior_title_upper_body')}
          </Text>
          {sitting_upper_body.map(({ name, completed }) => (
            <RedirectTile
              key={name}
              title={physicalExercisesName[name as unknown as keyof typeof physicalExercisesName]}
              subtitle={completed ? t('senior_title_completed') : undefined}
              isCompleted={completed}
              redirectTo={getRedirectToConfig(name, completed)}
            />
          ))}
        </div>
      )}
    </TopBarLayout>
  );
};

export default PhysicalActivities;
