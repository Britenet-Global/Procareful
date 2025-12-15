import {
  getUserControllerGetBrainPointsQueryKey,
  getUserControllerGetDashboardQueryKey,
  getUserControllerGetUserActivitiesListQueryKey,
  useUserControllerGetUserActivity,
  useUserControllerUpdateBrainPoints,
  useUserControllerUpdateUserPhysicalActivitiesScores,
  type UpdateUserPhysicalActivitiesScoresDtoName,
  type UpdateUserPhysicalActivitiesScoresDtoTimeOfDay,
  type UserControllerGetUserActivitiesListExerciseType,
} from '@Procareful/common/api';
import {
  useNotificationContext,
  useTypedTranslation,
  SearchParams,
  ProcarefulAppPathRoutes,
} from '@Procareful/common/lib';
import { Text, Title } from '@Procareful/ui';
import ProcarefulLogo from '@Procareful/ui/assets/icons/procareful-logo.svg?react';
import TopBarLayout from '@ProcarefulApp/layout/TopBarLayout';
import { useStylish } from '@ProcarefulApp/styles/activityDetailsStyles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from 'antd';
import { physicalExercisesName } from '../PhysicalActivity/constants';
import { POINTS_VALUE_TO_ADD, WALKING_EXERCISE_QUERY_PARAMS } from './constants';
import { renderActivityIcon } from './helpers';

const PhysicalActivityDetails = () => {
  const stylish = useStylish();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { notificationApi } = useNotificationContext();
  const queryClient = useQueryClient();
  const isWalkingExercises = pathname === ProcarefulAppPathRoutes.PhysicalActivitiesWalking;
  const activityName = searchParams.get(SearchParams.Name);
  const hasCompletedParams = searchParams.has(SearchParams.IsCompleted);
  const isActivityCompleted = searchParams.get(SearchParams.IsCompleted) === 'true';
  const exerciseType = (searchParams.get(SearchParams.ExerciseType) ||
    undefined) as UserControllerGetUserActivitiesListExerciseType;

  const { mutate: handleUpdateBrainPoints, isPending: isUpdateBrainPointsPending } =
    useUserControllerUpdateBrainPoints({
      mutation: {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: getUserControllerGetUserActivitiesListQueryKey({
              exercise_type: exerciseType,
            }),
          });
          queryClient.invalidateQueries({ queryKey: getUserControllerGetDashboardQueryKey() });
          queryClient.invalidateQueries({ queryKey: getUserControllerGetBrainPointsQueryKey() });

          notificationApi.success({
            message: t('senior_title_exercise_completed'),
            description: t('senior_inf_exercise_marked_as_completed'),
          });

          searchParams.delete(SearchParams.IsCompleted);
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set(SearchParams.IsCompleted, 'true');
          setSearchParams(newSearchParams, { replace: true });
        },
      },
    });

  const { data: activityData, isLoading: isUserActivityLoading } = useUserControllerGetUserActivity(
    {
      exercise: isWalkingExercises ? WALKING_EXERCISE_QUERY_PARAMS : activityName || '',
    }
  );

  const { description, name, position, video, repetitions, time } = activityData?.details || {};

  const { mutate: handleCompleteActivity, isPending: isCompleteActivityPending } =
    useUserControllerUpdateUserPhysicalActivitiesScores({
      mutation: {
        onSuccess: () => {
          handleUpdateBrainPoints({ data: { points: POINTS_VALUE_TO_ADD } });
        },
      },
    });

  const handleCompleteActivityClick = () => {
    if (activityName || isWalkingExercises) {
      handleCompleteActivity({
        data: {
          name: (isWalkingExercises
            ? WALKING_EXERCISE_QUERY_PARAMS
            : activityName) as UpdateUserPhysicalActivitiesScoresDtoName,
          time_of_day: exerciseType as unknown as UpdateUserPhysicalActivitiesScoresDtoTimeOfDay,
        },
      });
    }
  };

  const handleNavigateToVideo = () => {
    if (!video?.id) {
      return;
    }

    navigate({
      pathname: ProcarefulAppPathRoutes.PhysicalActivityDetailsVideo,
      search: new URLSearchParams({
        [SearchParams.Id]: video?.id.toString(),
      }).toString(),
    });
  };

  return (
    <TopBarLayout onClick={() => navigate(-1)} isLoading={isUserActivityLoading}>
      <div className={stylish.container}>
        <div>
          <div className={stylish.imageContainer}>
            <span className={stylish.circularBackground}>
              {renderActivityIcon(activityName, position)}
            </span>
          </div>
          <div className={stylish.headingContainer}>
            <Title level={4} className={stylish.titleHeader}>
              {physicalExercisesName[name as unknown as keyof typeof physicalExercisesName]}
            </Title>
            <Text className={stylish.description}>{description}</Text>
            <div className={stylish.iconsMainContainer}>
              <div className={stylish.repetitionContainer}>
                {repetitions && (
                  <Text strong>
                    {t('senior_inf_repetition_count_times', { count: repetitions.toString() })}
                  </Text>
                )}
              </div>
              <div className={stylish.iconContainer}>
                {time && (
                  <>
                    <AccessTimeIcon className={stylish.timeIcon} />
                    <Text className={stylish.iconDescription}>
                      {t('senior_inf_time_in_minutes', { time: time.toString() })}
                    </Text>
                  </>
                )}
                <ProcarefulLogo className={stylish.brainIcon} />
                <Text className={stylish.iconDescription}>{POINTS_VALUE_TO_ADD}</Text>
              </div>
            </div>
          </div>
        </div>
        <div className={stylish.buttonContainer}>
          <Button
            type="primary"
            size="large"
            onClick={handleCompleteActivityClick}
            loading={isCompleteActivityPending || isUpdateBrainPointsPending}
            disabled={isActivityCompleted || !hasCompletedParams}
          >
            {t('senior_btn_completed')}
          </Button>
          {!!video && (
            <Button size="large" onClick={handleNavigateToVideo} disabled={!video}>
              {t('senior_btn_watch_video')}
            </Button>
          )}
        </div>
      </div>
    </TopBarLayout>
  );
};

export default PhysicalActivityDetails;
