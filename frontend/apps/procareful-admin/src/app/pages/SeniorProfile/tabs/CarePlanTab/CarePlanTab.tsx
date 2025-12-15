import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from 'antd';
import ActivityIcon from '@ProcarefulAdmin/components/ActivityIcon';
import StyledCard from '@ProcarefulAdmin/components/StyledCard';
import { CarePlanEditParams, PaginationSize } from '@ProcarefulAdmin/constants';
import { verifyAccessByRole } from '@ProcarefulAdmin/utils';
import {
  useCaregiverControllerGetUserSchedule,
  type GenerateSchedulesDtoUserMobility,
  type GetMeResponseDto,
  getAuthControllerGetMeQueryKey,
  AdminRolesDtoRoleName,
  useCaregiverControllerGetUser,
} from '@Procareful/common/api';
import { useTypedTranslation, SearchParams } from '@Procareful/common/lib';
import { Text, Title } from '@Procareful/ui';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ActivityDetails from './ActivityDetails';
import CarePlanChangeInfoModal from './CarePlanChangeInfoModal';
import ConfirmCarePlanUpdateModal from './ConfirmCarePlanUpdateModal';
import EditCarePlanModal from './EditCarePlanModal';
import { noDataConfig } from './constants';
import { useStyles } from './styles';

const CarePlanTab = () => {
  const { styles, cx } = useStyles();
  const { t } = useTypedTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const seniorId = searchParams.get(SearchParams.Id);
  const queryClient = useQueryClient();

  const isEditCarePlanStep =
    searchParams.get(SearchParams.Step) === CarePlanEditParams.EditCarePlan;
  const isConfirmCarePlanUpdateStep =
    searchParams.get(SearchParams.Step) === CarePlanEditParams.ConfirmUpdate;

  const hasStepParams = searchParams.has(SearchParams.Step);

  const userData: GetMeResponseDto | undefined = queryClient.getQueryData(
    getAuthControllerGetMeQueryKey()
  );

  const isFormalCaregiver = verifyAccessByRole(
    AdminRolesDtoRoleName.formalCaregiver,
    userData?.details.admin.roles
  );

  const {
    data: seniorData,
    isLoading: isSeniorDataLoading,
    isSuccess,
  } = useCaregiverControllerGetUser(Number(seniorId), {
    page: 1,
    pageSize: PaginationSize.Large,
  });

  const { data: userScheduleData, isLoading: isScheduleDataLoading } =
    useCaregiverControllerGetUserSchedule(Number(seniorId), {
      query: { enabled: !!seniorData?.details.activities_assigned },
    });

  const {
    breathing_level,
    physical_level,
    user_breathing_exercises,
    user_physical_exercises,
    user_walking_exercises,
    personal_growth,
  } = userScheduleData?.details || {};

  const { assessment_completed, activities_assigned, activity_group } = seniorData?.details || {};
  const limitationType = activity_group as unknown as GenerateSchedulesDtoUserMobility;
  const showNoDataPlaceholder = isSuccess && (!assessment_completed || !activities_assigned);
  const noDataConfigKey = !assessment_completed ? 'assessment' : 'carePlan';
  const isCarePlanAssigned = !!activities_assigned;
  const { title, subtitle, buttonText, redirectTo } = noDataConfig[noDataConfigKey] || {};

  const handlePlaceholderButtonClick = () => {
    if (!seniorId) {
      return;
    }

    navigate({
      pathname: redirectTo,
      search: new URLSearchParams({
        [SearchParams.Id]: seniorId,
      }).toString(),
    });
  };

  const handleEditButtonClick = () => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set(SearchParams.Step, CarePlanEditParams.ConfirmUpdate);
    setSearchParams(nextSearchParams, { replace: true });
  };

  const handleRenderCardTitle = () => (
    <div className={styles.cardTitleContainer}>
      <Title level={5}>{t('admin_title_care_plan')}</Title>
      {isFormalCaregiver && (
        <Button
          icon={<EditOutlinedIcon />}
          disabled={!isCarePlanAssigned}
          onClick={handleEditButtonClick}
        >
          {t('shared_btn_edit_plan')}
        </Button>
      )}
    </div>
  );

  const handleRenderCardContent = () => {
    if (showNoDataPlaceholder) {
      return (
        <div className={styles.placeholderContainer}>
          <DashboardOutlinedIcon className={styles.placeholderIcon} />
          <Title level={6} className={styles.placeholderTitle}>
            {title}
          </Title>
          <Text className={styles.placeholderSubtitle}>{subtitle}</Text>
          {isFormalCaregiver && (
            <Button type="primary" onClick={handlePlaceholderButtonClick}>
              {buttonText}
            </Button>
          )}
        </div>
      );
    }

    return (
      <>
        {physical_level && user_physical_exercises && (
          <ActivityDetails
            type="physical"
            level={physical_level}
            exercisesData={user_physical_exercises}
            limitationType={limitationType}
            icon={<ActivityIcon activityType="physicalActivities" />}
          />
        )}
        {user_walking_exercises && (
          <ActivityDetails
            type="walking"
            exerciseData={user_walking_exercises}
            icon={<ActivityIcon activityType="walking" />}
          />
        )}
        {breathing_level && user_breathing_exercises && (
          <ActivityDetails
            type="breathing"
            level={breathing_level}
            exercisesData={user_breathing_exercises}
            limitationType={limitationType}
            icon={<ActivityIcon activityType="breathingExercises" />}
          />
        )}
        <ActivityDetails
          type="cognitiveGames"
          icon={<ActivityIcon activityType="cognitiveGames" />}
        />
        <ActivityDetails
          type="personalGrowth"
          isAssigned={!!personal_growth}
          challengeType={personal_growth}
          icon={personal_growth ? <ActivityIcon activityType="personalGrowth" /> : undefined}
        />
      </>
    );
  };

  const handleToggleModalVisibility = () => {
    searchParams.delete(SearchParams.Step);
    const nextSearchParams = new URLSearchParams(searchParams);
    setSearchParams(nextSearchParams, { replace: true });
  };

  return (
    <>
      <StyledCard
        fullHeight={!user_walking_exercises}
        title={handleRenderCardTitle()}
        className={cx(styles.cardContainer, {
          [styles.centeredContent]: showNoDataPlaceholder,
        })}
        loading={isSeniorDataLoading || isScheduleDataLoading}
      >
        {handleRenderCardContent()}
      </StyledCard>
      <EditCarePlanModal isVisible={isEditCarePlanStep} toggleModal={handleToggleModalVisibility} />
      <CarePlanChangeInfoModal
        isVisible={isConfirmCarePlanUpdateStep}
        toggleModal={handleToggleModalVisibility}
      />
      <ConfirmCarePlanUpdateModal
        isVisible={!isEditCarePlanStep && !isConfirmCarePlanUpdateStep && hasStepParams}
        toggleModal={handleToggleModalVisibility}
      />
    </>
  );
};

export default CarePlanTab;
