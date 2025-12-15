import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { PathRoutes } from '@ProcarefulAdmin/constants';
import {
  GetUserMobilityLevelMobilityLevel,
  useCaregiverControllerGetUserAssessmentScoresMobilityLevel,
  useCaregiverControllerGetUserSchedule,
  useCaregiverControllerGetWalkingTime,
} from '@Procareful/common/api';
import { useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import { Spinner } from '@Procareful/ui';
import { AssignActivitiesParams } from '../AssignActivities/types';
import BedriddenCustomSchedule from './BedriddenCustomSchedule';
import PhysicalLimitationsCustomSchedule from './PhysicalLimitationsCustomSchedule';
import WithoutLimitationsCustomSchedule from './WithoutLimitationsCustomSchedule';

const BuildCustomSchedule = () => {
  const { t } = useTypedTranslation();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const isEditScheduleRoute = location.pathname === PathRoutes.SeniorEditProfileEditSchedule;
  const seniorId = Number(searchParams.get(SearchParams.Id));

  const { data: userScheduleData, isLoading: isFetchUserScheduleLoading } =
    useCaregiverControllerGetUserSchedule(Number(seniorId), {
      query: { enabled: isEditScheduleRoute },
    });

  const { data: walkingTimeData, isLoading: isWalkingTimeDataLoading } =
    useCaregiverControllerGetWalkingTime(Number(seniorId), {
      query: { enabled: !isEditScheduleRoute },
    });

  const seniorDetailsRedirectConfig = {
    pathname: PathRoutes.SeniorProfile,
    search: new URLSearchParams({
      [SearchParams.Id]: seniorId.toString(),
      [SearchParams.Name]: t('admin_title_care_plan'),
    }).toString(),
  };

  const { data, isLoading } = useCaregiverControllerGetUserAssessmentScoresMobilityLevel(seniorId);

  const { mobility_level: limitationType, recommended_level: recommendedLevel } =
    data?.details || {};

  const handleNavigateToChallengePick = () => {
    const assignActivitiesRedirectConfig = {
      pathname: PathRoutes.SeniorAddAssignActivities,
      search: new URLSearchParams({
        [SearchParams.Step]: AssignActivitiesParams.Challenge,
        [SearchParams.Id]: seniorId.toString(),
      }).toString(),
    };

    navigate(assignActivitiesRedirectConfig);
  };

  if (
    isLoading ||
    (isFetchUserScheduleLoading && isEditScheduleRoute) ||
    isWalkingTimeDataLoading
  ) {
    return <Spinner />;
  }

  return (
    <>
      {limitationType === GetUserMobilityLevelMobilityLevel.mobility_limitation_activities && (
        <PhysicalLimitationsCustomSchedule
          scheduleData={userScheduleData?.details}
          seniorId={seniorId}
          redirectTo={seniorDetailsRedirectConfig}
          walkingTime={walkingTimeData?.details}
          onConfirmAddSchedule={handleNavigateToChallengePick}
        />
      )}
      {limitationType === GetUserMobilityLevelMobilityLevel.bedridden_activities && (
        <BedriddenCustomSchedule
          scheduleData={userScheduleData?.details}
          seniorId={seniorId}
          redirectTo={seniorDetailsRedirectConfig}
          walkingTime={walkingTimeData?.details}
          onConfirmAddSchedule={handleNavigateToChallengePick}
        />
      )}
      {limitationType === GetUserMobilityLevelMobilityLevel.without_limitation_activities &&
        recommendedLevel && (
          <WithoutLimitationsCustomSchedule
            recommendedLevel={recommendedLevel}
            scheduleData={userScheduleData?.details}
            seniorId={seniorId}
            redirectTo={seniorDetailsRedirectConfig}
            walkingTime={walkingTimeData?.details}
            onConfirmAddSchedule={handleNavigateToChallengePick}
          />
        )}
    </>
  );
};

export default BuildCustomSchedule;
